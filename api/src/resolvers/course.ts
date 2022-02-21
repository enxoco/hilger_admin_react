import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Int, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { getConnection } from "typeorm";
import { Course } from "../entities/Course";
import { Student } from '../entities/Student';
import { isAuth } from "../middleware/isAuth";

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

  // @FieldResolver(() => User)
  // courseCreator(
  //   @Root() course: Course,
  //   @Ctx() {userLoader}: MyContext
  // ){
  //   return userLoader.load(course)
  // }

  @Query(() => PaginatedCourses)
  async courses(
    @Arg('limit', () => Int) limit: number,
    @Arg('student', () => Int, {nullable: true}) studentId: number | null,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
     // Get all posts newer than timestamp passed in.
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
    ${cursor ? `WHERE p."createdAt" < $2` : `${studentId ? `WHERE p."studentId" = ${studentId}` : ''}`}
    ORDER BY p."createdAt" DESC
    LIMIT $1
    
    `, replacements)

    const student = await Student.find({
      where: {id: studentId}
    })
      // student = await getConnection().query(`
      // SELECT p.*
      // FROM student p
      // WHERE id = ${studentId}`)
    
    return { 
      courses: courses.slice(0, realLimit), 
      student,
      hasMore: courses.length === realLimitPlusOne}// getMany is what executes sql.
  }
  @Query(() => [Course], {nullable: true})
  async myCourses(
    @Arg("id", () => Int) id: number,
    @Arg("type", () => String) type: string
    ) {

      const courses = await getConnection()
      .getRepository(Course)
      .createQueryBuilder("course")
      .leftJoinAndSelect('course.teacher', 'user')
      .leftJoinAndSelect('course.student', 'student')
      .where(`course.${type}Id = :id`, {id})
      .orderBy('student.firstName', 'ASC')
      .getMany()
    // return Course.find(
    //   {
    //     where: {
    //       creatorId: id
    //     }
    //   }
    // )
    return courses
  }

  @Query(() => [Course], {nullable: true})
  async allMyCourses(){
    const courses = await getConnection()
    .getRepository(Course)
    .createQueryBuilder("course")
    .leftJoinAndSelect('course.teacher', 'user')
    .leftJoinAndSelect('course.student', 'student')
    .getMany()
    return courses
  }

  // @Query(() => [Course], {nullable: true})
  // async fetchMyCourses(id: , whoami){
  //   const courses = await getConnection()
  //   .getRepository(Course)
  //   .createQueryBuilder("course")
  //   .leftJoinAndSelect('course.teacher', 'user')
  //   .leftJoinAndSelect('course.student', 'student')
  //   .getMany()
  //   return courses
  // }

  @Query(() => Course, { nullable: true })
  async course(@Arg("id", () => Int) id: number): Promise<Course | undefined> {
    const courses = await getConnection()
    .getRepository(Course)
    .createQueryBuilder("course")
    .leftJoinAndSelect('course.teacher', 'user')
    .leftJoinAndSelect('course.student', 'student')
    .where("course.id = :id", {id})
    .getOne()
    return courses
  }

  @Mutation(() => Course)
  @UseMiddleware(isAuth)
  async createCourse(@Arg("input") input: CourseInput , @Ctx() { req }: MyContext): Promise<Course> {
    if(input.student){
      input.student = +input.student
    }

    input.teacher = req.session.userId
    input.student = input.student
    return Course.create({ ...input, teacher: req.session.userId, student: input.studentId}).save();
  }

  @Mutation(() => Course, { nullable: true })
  @UseMiddleware(isAuth)
  async updateCourse(
  @Arg("id", () => Int) id: number, 
  @Arg("courseName") courseName: string,
  @Arg("grade") grade: string,
  @Arg("feedback") feedback: string) :   
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
  async deleteCourse(@Arg("id", () => Int) id: number): Promise<boolean> {
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
