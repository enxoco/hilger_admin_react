import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Course = {
  __typename?: 'Course';
  courseName: Scalars['String'];
  createdAt: Scalars['String'];
  feedback: Scalars['String'];
  grade: Scalars['String'];
  id: Scalars['Int'];
  student: Student;
  teacher: User;
  updatedAt: Scalars['String'];
};

export type CourseInput = {
  courseName: Scalars['String'];
  feedback: Scalars['String'];
  grade: Scalars['String'];
  studentId: Scalars['Float'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: UserResponse;
  createCourse: Course;
  createPost: Post;
  createStudent: Student;
  deleteCourse: Scalars['Boolean'];
  deletePost: Scalars['Boolean'];
  deleteStudent: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: UserResponse;
  toggleAdmin: Scalars['Boolean'];
  updateCourse?: Maybe<Course>;
  updatePost?: Maybe<Post>;
  updateStudent?: Maybe<Student>;
  vote: Scalars['Boolean'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationCreateCourseArgs = {
  input: CourseInput;
};


export type MutationCreatePostArgs = {
  input: PostInput;
};


export type MutationCreateStudentArgs = {
  input: StudentInput;
};


export type MutationDeleteCourseArgs = {
  id: Scalars['Int'];
};


export type MutationDeletePostArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteStudentArgs = {
  id: Scalars['Int'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationToggleAdminArgs = {
  adminStatus: Scalars['Boolean'];
  teacherId: Scalars['Float'];
};


export type MutationUpdateCourseArgs = {
  courseName: Scalars['String'];
  feedback: Scalars['String'];
  grade: Scalars['String'];
  id: Scalars['Int'];
};


export type MutationUpdatePostArgs = {
  id: Scalars['Int'];
  text: Scalars['String'];
  title: Scalars['String'];
};


export type MutationUpdateStudentArgs = {
  firstName: Scalars['String'];
  id: Scalars['Int'];
  lastName: Scalars['String'];
};


export type MutationVoteArgs = {
  postId: Scalars['Int'];
  value: Scalars['Int'];
};

export type PaginatedCourses = {
  __typename?: 'PaginatedCourses';
  courses: Array<Course>;
  hasMore: Scalars['Boolean'];
  student: Array<Student>;
};

export type PaginatedPosts = {
  __typename?: 'PaginatedPosts';
  hasMore: Scalars['Boolean'];
  posts: Array<Post>;
};

export type Post = {
  __typename?: 'Post';
  createdAt: Scalars['String'];
  creator: User;
  creatorId: Scalars['Float'];
  id: Scalars['Int'];
  points: Scalars['String'];
  text: Scalars['String'];
  textSnippet: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['String'];
  voteStatus?: Maybe<Scalars['Int']>;
};

export type PostInput = {
  text: Scalars['String'];
  title: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  allMyCourses?: Maybe<Array<Course>>;
  course?: Maybe<Course>;
  courses: PaginatedCourses;
  hello: Scalars['String'];
  me?: Maybe<User>;
  myCourses?: Maybe<Array<Course>>;
  post?: Maybe<Post>;
  posts: PaginatedPosts;
  student?: Maybe<Student>;
  students: Array<Student>;
  teachers?: Maybe<Array<User>>;
};


export type QueryCourseArgs = {
  id: Scalars['Int'];
};


export type QueryCoursesArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
  student?: Maybe<Scalars['Int']>;
};


export type QueryMyCoursesArgs = {
  id: Scalars['Int'];
  type: Scalars['String'];
};


export type QueryPostArgs = {
  id: Scalars['Int'];
};


export type QueryPostsArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryStudentArgs = {
  id: Scalars['Int'];
};

export type Student = {
  __typename?: 'Student';
  createdAt: Scalars['String'];
  firstName: Scalars['String'];
  fullName: Scalars['String'];
  id: Scalars['Int'];
  lastName: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type StudentInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  avatar: Scalars['String'];
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  fullName: Scalars['String'];
  id: Scalars['Int'];
  isAdmin: Scalars['Boolean'];
  lastName: Scalars['String'];
  role: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UsernamePasswordInput = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type PostSnippetFragment = { __typename?: 'Post', id: number, createdAt: string, updatedAt: string, title: string, textSnippet: string, points: string, voteStatus?: Maybe<number>, creator: { __typename?: 'User', id: number, username: string } };

export type RegularErrorFragment = { __typename?: 'FieldError', field: string, message: string };

export type RegularUserFragment = { __typename?: 'User', id: number, username: string, isAdmin: boolean };

export type RegularUserResponseFragment = { __typename?: 'UserResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, user?: Maybe<{ __typename?: 'User', id: number, username: string, isAdmin: boolean }> };

export type StudentSnippetFragment = { __typename?: 'Student', id: number, createdAt: string, updatedAt: string, firstName: string, lastName: string, fullName: string };

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'UserResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, user?: Maybe<{ __typename?: 'User', id: number, username: string, isAdmin: boolean }> } };

export type CreateCourseMutationVariables = Exact<{
  input: CourseInput;
}>;


export type CreateCourseMutation = { __typename?: 'Mutation', createCourse: { __typename?: 'Course', id: number, createdAt: string, updatedAt: string, courseName: string, grade: string, feedback: string } };

export type CreatePostMutationVariables = Exact<{
  input: PostInput;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'Post', id: number, createdAt: string, updatedAt: string, title: string, text: string, points: string, creatorId: number } };

export type CreateStudentMutationVariables = Exact<{
  input: StudentInput;
}>;


export type CreateStudentMutation = { __typename?: 'Mutation', createStudent: { __typename?: 'Student', id: number, createdAt: string, updatedAt: string, firstName: string, lastName: string } };

export type DeleteCourseMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteCourseMutation = { __typename?: 'Mutation', deleteCourse: boolean };

export type DeletePostMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost: boolean };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, user?: Maybe<{ __typename?: 'User', id: number, username: string, isAdmin: boolean }> } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, user?: Maybe<{ __typename?: 'User', id: number, username: string, isAdmin: boolean }> } };

export type ToggleAdminMutationVariables = Exact<{
  adminStatus: Scalars['Boolean'];
  teacherId: Scalars['Float'];
}>;


export type ToggleAdminMutation = { __typename?: 'Mutation', toggleAdmin: boolean };

export type UpdateCourseMutationVariables = Exact<{
  id: Scalars['Int'];
  courseName: Scalars['String'];
  feedback: Scalars['String'];
  grade: Scalars['String'];
}>;


export type UpdateCourseMutation = { __typename?: 'Mutation', updateCourse?: Maybe<{ __typename?: 'Course', id: number, courseName: string, grade: string, feedback: string }> };

export type UpdatePostMutationVariables = Exact<{
  id: Scalars['Int'];
  title: Scalars['String'];
  text: Scalars['String'];
}>;


export type UpdatePostMutation = { __typename?: 'Mutation', updatePost?: Maybe<{ __typename?: 'Post', title: string, text: string, id: number, textSnippet: string }> };

export type VoteMutationVariables = Exact<{
  value: Scalars['Int'];
  postId: Scalars['Int'];
}>;


export type VoteMutation = { __typename?: 'Mutation', vote: boolean };

export type CourseQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type CourseQuery = { __typename?: 'Query', course?: Maybe<{ __typename?: 'Course', id: number, createdAt: string, updatedAt: string, courseName: string, grade: string, feedback: string, student: { __typename?: 'Student', fullName: string } }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: Maybe<{ __typename?: 'User', fullName: string, isAdmin: boolean, id: number, username: string }> };

export type MyCoursesQueryVariables = Exact<{
  type: Scalars['String'];
  id: Scalars['Int'];
}>;


export type MyCoursesQuery = { __typename?: 'Query', myCourses?: Maybe<Array<{ __typename?: 'Course', id: number, courseName: string, grade: string, feedback: string, student: { __typename?: 'Student', id: number, createdAt: string, updatedAt: string, firstName: string, lastName: string, fullName: string }, teacher: { __typename?: 'User', firstName: string, lastName: string, id: number, isAdmin: boolean } }>> };

export type PostQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type PostQuery = { __typename?: 'Query', post?: Maybe<{ __typename?: 'Post', id: number, createdAt: string, updatedAt: string, title: string, text: string, points: string, voteStatus?: Maybe<number>, creator: { __typename?: 'User', id: number, username: string } }> };

export type PostsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type PostsQuery = { __typename?: 'Query', posts: { __typename?: 'PaginatedPosts', hasMore: boolean, posts: Array<{ __typename?: 'Post', id: number, createdAt: string, updatedAt: string, title: string, textSnippet: string, points: string, voteStatus?: Maybe<number>, creator: { __typename?: 'User', id: number, username: string } }> } };

export type ViewProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type ViewProfileQuery = { __typename?: 'Query', me?: Maybe<{ __typename?: 'User', id: number, email: string, username: string, avatar: string }> };

export type StudentQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type StudentQuery = { __typename?: 'Query', student?: Maybe<{ __typename?: 'Student', id: number, createdAt: string, updatedAt: string, firstName: string, lastName: string }> };

export type StudentsQueryVariables = Exact<{ [key: string]: never; }>;


export type StudentsQuery = { __typename?: 'Query', students: Array<{ __typename?: 'Student', id: number, createdAt: string, updatedAt: string, firstName: string, lastName: string, fullName: string }> };

export type TeachersQueryVariables = Exact<{ [key: string]: never; }>;


export type TeachersQuery = { __typename?: 'Query', teachers?: Maybe<Array<{ __typename?: 'User', firstName: string, lastName: string, email: string, isAdmin: boolean, id: number }>> };

export const PostSnippetFragmentDoc = gql`
    fragment PostSnippet on Post {
  id
  createdAt
  updatedAt
  title
  textSnippet
  points
  voteStatus
  creator {
    id
    username
  }
}
    `;
export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
  isAdmin
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
  errors {
    ...RegularError
  }
  user {
    ...RegularUser
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export const StudentSnippetFragmentDoc = gql`
    fragment StudentSnippet on Student {
  id
  createdAt
  updatedAt
  firstName
  lastName
  fullName
}
    `;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const CreateCourseDocument = gql`
    mutation CreateCourse($input: CourseInput!) {
  createCourse(input: $input) {
    id
    createdAt
    updatedAt
    courseName
    grade
    feedback
  }
}
    `;

export function useCreateCourseMutation() {
  return Urql.useMutation<CreateCourseMutation, CreateCourseMutationVariables>(CreateCourseDocument);
};
export const CreatePostDocument = gql`
    mutation CreatePost($input: PostInput!) {
  createPost(input: $input) {
    id
    createdAt
    updatedAt
    title
    text
    points
    creatorId
  }
}
    `;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};
export const CreateStudentDocument = gql`
    mutation CreateStudent($input: StudentInput!) {
  createStudent(input: $input) {
    id
    createdAt
    updatedAt
    firstName
    lastName
  }
}
    `;

export function useCreateStudentMutation() {
  return Urql.useMutation<CreateStudentMutation, CreateStudentMutationVariables>(CreateStudentDocument);
};
export const DeleteCourseDocument = gql`
    mutation DeleteCourse($id: Int!) {
  deleteCourse(id: $id)
}
    `;

export function useDeleteCourseMutation() {
  return Urql.useMutation<DeleteCourseMutation, DeleteCourseMutationVariables>(DeleteCourseDocument);
};
export const DeletePostDocument = gql`
    mutation DeletePost($id: Int!) {
  deletePost(id: $id)
}
    `;

export function useDeletePostMutation() {
  return Urql.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($options: UsernamePasswordInput!) {
  register(options: $options) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const ToggleAdminDocument = gql`
    mutation ToggleAdmin($adminStatus: Boolean!, $teacherId: Float!) {
  toggleAdmin(adminStatus: $adminStatus, teacherId: $teacherId)
}
    `;

export function useToggleAdminMutation() {
  return Urql.useMutation<ToggleAdminMutation, ToggleAdminMutationVariables>(ToggleAdminDocument);
};
export const UpdateCourseDocument = gql`
    mutation UpdateCourse($id: Int!, $courseName: String!, $feedback: String!, $grade: String!) {
  updateCourse(
    courseName: $courseName
    feedback: $feedback
    grade: $grade
    id: $id
  ) {
    id
    courseName
    grade
    feedback
  }
}
    `;

export function useUpdateCourseMutation() {
  return Urql.useMutation<UpdateCourseMutation, UpdateCourseMutationVariables>(UpdateCourseDocument);
};
export const UpdatePostDocument = gql`
    mutation UpdatePost($id: Int!, $title: String!, $text: String!) {
  updatePost(text: $text, title: $title, id: $id) {
    title
    text
    id
    textSnippet
  }
}
    `;

export function useUpdatePostMutation() {
  return Urql.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument);
};
export const VoteDocument = gql`
    mutation Vote($value: Int!, $postId: Int!) {
  vote(value: $value, postId: $postId)
}
    `;

export function useVoteMutation() {
  return Urql.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument);
};
export const CourseDocument = gql`
    query Course($id: Int!) {
  course(id: $id) {
    id
    createdAt
    updatedAt
    courseName
    grade
    feedback
    student {
      fullName
    }
  }
}
    `;

export function useCourseQuery(options: Omit<Urql.UseQueryArgs<CourseQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<CourseQuery>({ query: CourseDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    fullName
    isAdmin
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const MyCoursesDocument = gql`
    query MyCourses($type: String!, $id: Int!) {
  myCourses(type: $type, id: $id) {
    student {
      ...StudentSnippet
    }
    teacher {
      firstName
      lastName
      id
      isAdmin
    }
    id
    courseName
    grade
    feedback
  }
}
    ${StudentSnippetFragmentDoc}`;

export function useMyCoursesQuery(options: Omit<Urql.UseQueryArgs<MyCoursesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MyCoursesQuery>({ query: MyCoursesDocument, ...options });
};
export const PostDocument = gql`
    query Post($id: Int!) {
  post(id: $id) {
    id
    createdAt
    updatedAt
    title
    text
    points
    voteStatus
    creator {
      id
      username
    }
  }
}
    `;

export function usePostQuery(options: Omit<Urql.UseQueryArgs<PostQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostQuery>({ query: PostDocument, ...options });
};
export const PostsDocument = gql`
    query Posts($limit: Int!, $cursor: String) {
  posts(cursor: $cursor, limit: $limit) {
    hasMore
    posts {
      ...PostSnippet
    }
  }
}
    ${PostSnippetFragmentDoc}`;

export function usePostsQuery(options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
};
export const ViewProfileDocument = gql`
    query ViewProfile {
  me {
    id
    email
    username
    avatar
  }
}
    `;

export function useViewProfileQuery(options: Omit<Urql.UseQueryArgs<ViewProfileQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ViewProfileQuery>({ query: ViewProfileDocument, ...options });
};
export const StudentDocument = gql`
    query Student($id: Int!) {
  student(id: $id) {
    id
    createdAt
    updatedAt
    firstName
    lastName
  }
}
    `;

export function useStudentQuery(options: Omit<Urql.UseQueryArgs<StudentQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<StudentQuery>({ query: StudentDocument, ...options });
};
export const StudentsDocument = gql`
    query Students {
  students {
    ...StudentSnippet
  }
}
    ${StudentSnippetFragmentDoc}`;

export function useStudentsQuery(options: Omit<Urql.UseQueryArgs<StudentsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<StudentsQuery>({ query: StudentsDocument, ...options });
};
export const TeachersDocument = gql`
    query Teachers {
  teachers {
    firstName
    lastName
    email
    isAdmin
    id
  }
}
    `;

export function useTeachersQuery(options: Omit<Urql.UseQueryArgs<TeachersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<TeachersQuery>({ query: TeachersDocument, ...options });
};