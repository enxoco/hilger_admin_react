import { MyContext } from "src/types";
import { Arg, Ctx, Field, FieldResolver, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { getConnection } from "typeorm";
import { isAuth } from "../middleware/isAuth";
import { Student } from "../entities/Student";


@InputType()
class StudentInput {
  @Field()
  firstName: string;
  @Field()
  lastName: string;
}

@ObjectType()
class PaginatedStudents {
  @Field(() => [Student])
  students: Student[]
  @Field()
  hasMore: boolean
}
@Resolver(Student)
export class StudentResolver {

  // Send back just a snippet of text from graphQl instead of the whole thing.
  @FieldResolver(() => String)
  textSnippet(
    @Root() root: Student
  ){
    return root.firstName.slice(0,50)
  }

  // Automatically fetch/return creator information with a post.
  // Magic...
  // User.findOne() triggers this
  // Batch all user ids into single function call.
  // @FieldResolver(() => User)
  // creator(
  //   @Root() post: Post,
  //   @Ctx() {userLoader}: MyContext
  // ){
  //   return userLoader.load(post.creatorId)
  // }

  // @FieldResolver(() => Int, {nullable: true})
  // async voteStatus(
  //   @Root() post: Post,
  //   @Ctx() {upvoteLoader, req}: MyContext
  // ){
  //   if (!req.session.id) {
  //     return null;
  //   }
  //   const upvote = await upvoteLoader.load({postId: post.id, userId: req.session.userId})
  //   return upvote ? upvote.value : null
  // }

  @Query(() => PaginatedStudents)
  async students(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null, // Get all posts newer than timestamp passed in.
  ): Promise<PaginatedStudents> {
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
    const students = await getConnection().query(`
    SELECT p.*
    FROM student p
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
    // const students = await qb.getMany()

    return { 
      students: students.slice(0, realLimit), 
      hasMore: students.length === realLimitPlusOne}// getMany is what executes sql.
  }

  @Query(() => Student, { nullable: true })
  student(@Arg("id", () => Int) id: number): Promise<Student | undefined> {
    return Student.findOne(id);
  }

  @Mutation(() => Student)
  @UseMiddleware(isAuth)
  async createStudent(@Arg("input") input: StudentInput): Promise<Student> {
    return Student.create({ ...input }).save();
  }

  @Mutation(() => Student, { nullable: true })
  @UseMiddleware(isAuth)
  async updateStudent(
  @Arg("id", () => Int) id: number, 
  @Arg("firstName") firstName: string,
  @Arg("lastName") lastName: string,
  @Ctx() { req } : MyContext) :   
   Promise<Student | null> {
    const result = await getConnection()
    .createQueryBuilder()
    .update(Student)
    .set({ firstName, lastName })
    .where('id = :id', { id })
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
  async deleteStudent(@Arg("id", () => Int) id: number,
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
    await Student.delete({id})
    return true;
  }
}
