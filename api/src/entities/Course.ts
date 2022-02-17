import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne, OneToMany } from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { User } from "./User";
@ObjectType()
@Entity()
export class Course extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column()
  courseName!: string;

  @Field(() => String)
  @Column()
  grade!: string;

  @Field(() => String)
  @Column()
  feedback!: string;

  @Field(() => Int)
  @Column()
  studentId!: number;

  @Field()
  @Column()
  creatorId: number;

  @Field(() => Course)
  @ManyToOne(() => User, (user) => user.courses)
  // Foreign field key.  creatorId
  courseCreator: User;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;



}
