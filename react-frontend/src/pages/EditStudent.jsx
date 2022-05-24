import { Box, Button, HStack, Stack, Text, Tooltip } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { FiDownloadCloud } from "react-icons/fi"
import { Link, useParams } from "react-router-dom"
import { useRecoilState } from "recoil"
import { impersonateUser, loggedInUser } from "../atom"
import AddStudentCard from "../components/AddStudentCard"
import EditStudentCard from "../components/EditCourseCard"
import Layout from "../components/Layout"
import { useCheckLoginQuery, useGetCoursesByStudentAndTeacherQuery, useGetStudentQuery } from "../generated/graphql"

const EditStudent = () => {
  let { id } = useParams()
  const [teacher, setTeacher] = useState(null)
  const [user, setUser] = useRecoilState(loggedInUser)
  const [me] = useCheckLoginQuery({ pause: user })

  // If we are reloading page then we have no state
  const [{ data: coursesData, error, fetching }, getCourses] = useGetCoursesByStudentAndTeacherQuery({
    pause: loggedInUser?.isParent,
    variables: {
      studentId: id,
      teacherId: teacher,
    },
  })

  const [studentData] = useGetStudentQuery({ variables: { id } })
  const [newCourse, setNewCourse] = useState(null)
  const [newCourseName] = useState("")
  const [newCourseGrade] = useState("")

  const [impersonatedUser] = useRecoilState(impersonateUser)
  const showNewCourseCard = () => {
    setNewCourse(true)
  }

  const hideNewCourseCard = () => {
    getCourses()
    setNewCourse(false)
  }

  useEffect(() => {
    if (!teacher && user && user.id) {
      setTeacher(user.id)
    }
  }, [user])

  useEffect(() => {
    if (!user && me.data) {
      setUser(me.data.authenticatedItem)
      setTeacher(me.data?.authenticatedItem.id)
    }
  }, [me.fetching])

  return (
    <Layout>
      <Stack spacing="4" direction={{ base: "column", lg: "row" }} justify="space-between" align={{ base: "start", lg: "center" }}>
        <HStack spacing="3">
          <Tooltip label="Download a CSV file">
            <Button variant="secondary" leftIcon={<FiDownloadCloud fontSize="1.25rem" />}>
              Export
            </Button>
          </Tooltip>
          <Button variant="primary" onClick={showNewCourseCard}>
            Add Course
          </Button>

          {user?.isAdmin || impersonatedUser ? (
            <Tooltip label={`View full report card for ${studentData.data?.firstName || "student"}`}>
              <Link to={"report"}>
                <Button variant="outline">View report card</Button>
              </Link>
            </Tooltip>
          ) : null}
        </HStack>
      </Stack>
      {!teacher || !studentData.data ? (
        <>loading</>
      ) : (
        <Stack spacing="5">
          <Box px={{ base: "4", md: "6" }} pt="5">
            <Stack direction={{ base: "column", md: "row" }} justify="space-between">
              <Text fontSize="lg" fontWeight="medium">
                Edit Student
              </Text>
            </Stack>
          </Box>
          {!fetching && loggedInUser && !studentData.fetching ? (
          <AddStudentCard student={studentData?.data?.student}/>
          ) : null}
          {!newCourse && studentData.data.student ? null : <EditStudentCard name={newCourseName} grade={newCourseGrade} feedback={null} id={null} student={id} teacher={impersonatedUser?.id || user.id} teacherName={impersonatedUser?.name || user.name} hideNewCourseCard={hideNewCourseCard} />}

          {!fetching && !studentData.fetching && coursesData.courses && coursesData.courses.length != 0 ? (
            coursesData.courses.map((course) => (
              <EditStudentCard key={course.id} name={course.name} grade={course.grade} id={course.id} student={id} teacher={impersonatedUser?.id || user.id} teacherName={impersonatedUser?.name || user.name} feedback={course.feedback} hideNewCourseCard={hideNewCourseCard} />
            ))
          ) : (
            <EditStudentCard name={newCourseName} grade={newCourseGrade} id={null} feedback={null} student={id} teacher={impersonatedUser?.id || user.id} teacherName={impersonatedUser?.name || user.name} hideNewCourseCard={hideNewCourseCard} />
          )}
        </Stack>
      )}
    </Layout>
  )
}

export default EditStudent
