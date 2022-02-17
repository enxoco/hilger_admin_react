import { MyContext } from "src/types";
import { Arg, Ctx, Field, FieldResolver, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { getConnection } from "typeorm";
import { isAuth } from "../middleware/isAuth";
import { Course } from "../entities/Course";
import { User } from "../entities/User";
import {Student} from '../entities/Student'


@InputType()
class CourseInput {
  @Field()
  courseName: string;
  @Field()
  grade: string;
  @Field()
  feedback: string;
  @Field()
  studentId: number;
}

@ObjectType()
class PaginatedCourses {
  @Field(() => [Course])
  courses: Course[]
  @Field()
  hasMore: boolean
  
  @Field(() => [Student])
  student: Student[]
}
@Resolver(Course)
export class CourseResolver {

  @FieldResolver(() => User)
  courseCreator(
    @Root() course: Course,
    @Ctx() {userLoader}: MyContext
  ){
    return userLoader.load(course.creatorId)
  }

  @Query(() => PaginatedCourses)
  async courses(
    @Arg('limit', () => Int) limit: number,
    @Arg('student', () => Int, {nullable: true}) student: number | null,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
    @Ctx() { req }: MyContext // Get all posts newer than timestamp passed in.
  ): Promise<PaginatedCourses> {
    const realLimit = Math.min(50, limit)// Cap the limit at 50 if the user tries to pull more
    const realLimitPlusOne = realLimit + 1// User asks for 20 we fetch 21.  If we get less than 21 then we know there are no more posts

    const replacements: any[] = [realLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(+cursor))

    }

    // This is pretty nasty atm but basically, if there is a cursor then deal with that
    // else if there is a student id then just return courses for that student.
    let courses = await getConnection().query(`
    SELECT p.*
    FROM course p
    ${cursor ? `WHERE p."createdAt" < $2` : `${student ? `WHERE p."studentId" = ${student}` : ''}`}
    ORDER BY p."createdAt" DESC
    LIMIT $1
    
    `, replacements)

    let studentObj = {}
    if (student){
      studentObj = await getConnection().query(`
      SELECT p.*
      FROM student p
      WHERE id = ${student}`)
    }
    courses = courses.filter(course => course.creatorId == req.session.userId)
    return { 
      courses: courses.slice(0, realLimit), 
      student: studentObj,
      hasMore: courses.length === realLimitPlusOne}// getMany is what executes sql.
  }

  @Query(() => Course, { nullable: true })
  course(@Arg("id", () => Int) id: number): Promise<Course | undefined> {
    return Course.findOne(id);
  }

  @Mutation(() => Course)
  @UseMiddleware(isAuth)
  async createCourse(@Arg("input") input: CourseInput , @Ctx() { req }: MyContext): Promise<Course> {
    if(input.studentId){
      input.studentId = +input.studentId
    }
    return Course.create({ ...input, creatorId: req.session.userId}).save();
  }

  @Mutation(() => Course, { nullable: true })
  @UseMiddleware(isAuth)
  async updateCourse(
  @Arg("id", () => Int) id: number, 
  @Arg("courseName") courseName: string,
  @Arg("grade") grade: string,
  @Arg("feedback") feedback: string,
  @Ctx() { req } : MyContext) :   
   Promise<Course | null> {
    const result = await getConnection()
    .createQueryBuilder()
    .update(Course)
    .set({ courseName, grade, feedback })
    .where('id = :id', { id })
    .returning('*')
    .execute()

    return result.raw[0] as any

  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteCourse(@Arg("id", () => Int) id: number,
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
    await Course.delete({id})
    return true;
  }
}
