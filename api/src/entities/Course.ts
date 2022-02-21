import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Student } from "./Student";
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
  @Column({nullable: true})
  grade!: string;

  @Field(() => String)
  @Column()
  feedback!: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.courses)
  teacher: User;

  @Field(() => Student)
  @ManyToOne(() => Student, (student) => student.courses)
  student: Student;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;


}
