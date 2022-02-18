import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne, OneToMany } from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { User } from "./User";
import { Student } from "./Student";
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

  // @Field(() => Int)
  // @Column()
  // studentId!: Student;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.courses)
  // Foreign field key.  creatorId
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
