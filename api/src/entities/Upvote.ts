import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

// Many to many relationship
// user <-> posts
// several users can upvote a single post
// user -> updoot <- posts
@ObjectType()
@Entity()
export class Upvote extends BaseEntity {
  @Column({ type: "int"})
  value: number

  @Field()
  @PrimaryColumn()
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.upvotes)
  // Foreign field key.  creatorId
  user: User;

  @Field()
  @PrimaryColumn()
  postId: number;

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.upvotes, {
    onDelete: "CASCADE" // Automatically delete upvotes attached to a post when post is deleted.
  })
  post: Post;
}
