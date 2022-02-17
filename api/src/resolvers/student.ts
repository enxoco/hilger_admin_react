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
class Students {
  @Field(() => [Student])
  students: Student[]

}
@Resolver(Student)
export class StudentResolver {

  // Send back just a snippet of text from graphQl instead of the whole thing.
  @FieldResolver(() => String)
  fullName(
    @Root() root: Student
  ){
    return `${root.firstName} ${root.lastName}`
  }

  @Query(() => [Student])
  students() {
    return Student.find()
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

  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteStudent(@Arg("id", () => Int) id: number,
  @Ctx() { req }: MyContext): Promise<boolean> {

    await Student.delete({id})
    return true;
  }
}
