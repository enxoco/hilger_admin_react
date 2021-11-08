import { Upvote } from "../entities/Upvote";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, FieldResolver, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { getConnection } from "typeorm";
import { Post } from "../entities/Post";
import { isAuth } from "../middleware/isAuth";
import { User } from "../entities/User";


@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[]
  @Field()
  hasMore: boolean
}
@Resolver(Post)
export class PostResolver {

  // Send back just a snippet of text from graphQl instead of the whole thing.
  @FieldResolver(() => String)
  textSnippet(
    @Root() root: Post
  ){
    return root.text.slice(0,50)
  }

  // Automatically fetch/return creator information with a post.
  // Magic...
  // User.findOne() triggers this
  // Batch all user ids into single function call.
  @FieldResolver(() => User)
  creator(
    @Root() post: Post,
    @Ctx() {userLoader}: MyContext
  ){
    return userLoader.load(post.creatorId)
  }

  @FieldResolver(() => Int, {nullable: true})
  async voteStatus(
    @Root() post: Post,
    @Ctx() {upvoteLoader, req}: MyContext
  ){
    if (!req.session.id) {
      return null;
    }
    const upvote = await upvoteLoader.load({postId: post.id, userId: req.session.userId})
    return upvote ? upvote.value : null
  }
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg('postId', () => Int) postId: number,
    @Arg('value', () => Int) value: number,
    @Ctx() {req}: MyContext
  ) {
    const {userId} = req.session

    const upvote = await Upvote.findOne({where: {postId, userId}})
    const isUpvote = value !== -1
    const realValue = isUpvote ? 1 : -1

    // await Updoot.insert({
    //   userId,
    //   postId,
    //   value: realValue
    // })
    // the user has voted on the post before.
    // and they are changing their vote
    
    if (upvote && upvote.value !== realValue) {
      await getConnection().transaction(async (tm) => {
        await tm.query(`
        UPDATE upvote
        SET value = $1
        WHERE "postId" = $2 AND "userId" = $3`, [realValue, postId, userId])
        await tm.query(`
        UPDATE post
        SET points = points + $1
        WHERE id = $2;
        `, [2 * realValue, postId]
        )
      })
    } else if (!upvote) {// user has not voted yet
      getConnection().transaction(async tm => {
        await tm.query(`
        INSERT INTO upvote ("userId", "postId", value)
        VALUES ($1,$2,$3);
        `, [userId, postId, realValue])
        await tm.query(`
        UPDATE post
        SET points = points + $1
        WHERE id = $2;
        `, [realValue, postId])
      })
    
    }
    return true
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null, // Get all posts newer than timestamp passed in.
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit)// Cap the limit at 50 if the user tries to pull more
    const realLimitPlusOne = realLimit + 1// User asks for 20 we fetch 21.  If we get less than 21 then we know there are no more posts

    const replacements: any[] = [realLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(+cursor))

    }
    // Without fieldResolver creator.  Would have to use sql and inner join
    // const posts = await getConnection().query(`
    // SELECT p.*, 
    // // json_build_object(
    // //   'username', u.username, 
    // //   'email', u.email,
    // //   'createdAt', u."createdAt",
    // //   'updatedAt', u."updatedAt",
    // //   'id', u.id
    // //   ) creator,
    //   ${req.session.userId ? 
    //     '(SELECT value FROM upvote where "userId" = $2 AND "postId" = p.id) "voteStatus"' :
    //     'null as "voteStatus"'}
    // FROM post p
    // INNER JOIN public.user u ON u.id = p."creatorId"
    // ${cursor ? `WHERE p."createdAt" < $${cursorIndex}` : ''}
    // ORDER BY p."createdAt" DESC
    // LIMIT $1
    
    // `, replacements)
    const posts = await getConnection().query(`
    SELECT p.*
    FROM post p
    ${cursor ? `WHERE p."createdAt" < $2` : ''}
    ORDER BY p."createdAt" DESC
    LIMIT $1
    
    `, replacements)

    // const qb = getConnection()
    // .getRepository(Post)
    // .createQueryBuilder("p")
    // .innerJoinAndSelect(
    //   "p.creator",
    //   "u",
    //   "u.id = p.\"creatorId\""
    // )
    // .orderBy('p."createdAt"') // Keep the name of the column uppercase by adding single qoutes
    // .take(realLimitPlusOne)
    // if (cursor){
    //   qb.where('p."createdAt" > :cursor', {cursor: new Date(+cursor)})
    // }
    // const posts = await qb.getMany()

    return { 
      posts: posts.slice(0, realLimit), 
      hasMore: posts.length === realLimitPlusOne}// getMany is what executes sql.
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(@Arg("input") input: PostInput, @Ctx() { req }: MyContext): Promise<Post> {
    return Post.create({ ...input, creatorId: req.session.userId }).save();
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
  @Arg("id", () => Int) id: number, 
  @Arg("title") title: string,
  @Arg("text") text: string,
  @Ctx() { req } : MyContext) :   
   Promise<Post | null> {
    const result = await getConnection()
    .createQueryBuilder()
    .update(Post)
    .set({ title, text })
    .where('id = :id and "creatorId" = :creatorId', { id, creatorId: req.session.userId })
    .returning('*')
    .execute()

    return result.raw[0] as any
    // const post = await Post.findOne(id);
    // if (!post) {
    //   return null;
    // }
    // if (typeof title !== "undefined") {
    //   return Post.update({ id, creatorId }, { title, text });
    // }
    // return post;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(@Arg("id", () => Int) id: number,
  @Ctx() { req }: MyContext): Promise<boolean> {
    // without cascade way
    // const post = await Post.findOne(id)
    // if (!post) {
    //   return false
    // }

    // if (post.creatorId !== req.session.userId) {
    //   throw new Error('not authorized')
    // }

    // await Upvote.delete({ postId: id})
    // await Post.delete({ id });
    
    // using cascade
    await Post.delete({id, creatorId: req.session.userId})
    return true;
  }
}
