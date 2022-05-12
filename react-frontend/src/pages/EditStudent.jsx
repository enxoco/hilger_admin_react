import { Box, Button, Container, Flex, FormControl, FormLabel, HStack, Input, Stack, Text, Tooltip, useBreakpointValue, useColorModeValue } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { FiDownloadCloud } from "react-icons/fi"
import { useParams, Link } from "react-router-dom"
import { useRecoilState } from "recoil"
import { courses as coursesAtom, loggedInUser } from "../atom"
import EditStudentCard from "../components/EditCourseCard"
import { ImpersonateUserBanner } from "../components/ImpersonatedUserBanner"
import { impersonateUser } from "../atom"
import { Navbar } from "../components/Navbar"
import { Sidebar } from "../components/Sidebar"
import { useCheckLoginQuery, useGetCoursesByStudentAndTeacherQuery, useGetStudentQuery, useUpdateStudentInfoMutation } from "../generated/graphql"

const EditStudent = () => {
  const isDesktop = useBreakpointValue({ base: false, lg: true })
  const isMobile = useBreakpointValue({ base: true, md: false })
  let { id } = useParams()
  const [teacher, setTeacher] = useState(null)
  const [user, setUser] = useRecoilState(loggedInUser)
  const [me, executeMeQuery] = useCheckLoginQuery({ pause: user })

  // If we are reloading page then we have no state
  const [{ data: coursesData, error, fetching }, getCourses] = useGetCoursesByStudentAndTeacherQuery({
    pause: !teacher,
    requestPolicy: "cache-and-network",
    variables: {
      studentId: id,
      teacherId: teacher,
    },
  })

  const [studentData, getStudent] = useGetStudentQuery({ variables: { id } })

  const [newCourse, setNewCourse] = useState(null)
  const [newCourseName, setNewCourseName] = useState("")
  const [newCourseGrade, setNewCourseGrade] = useState("")
  const [courses, setCourses] = useRecoilState(coursesAtom)

  const [firstName, setFirstName] = useState(studentData?.data?.student?.firstName || null)
  const [lastName, setLastName] = useState(studentData?.data?.student?.lastName || null)
  const [updatedStudentInfo, updateStudentInfo] = useUpdateStudentInfoMutation({ variables: { id, firstName, lastName } })
  const [impersonatedUser] = useRecoilState(impersonateUser)
  const showNewCourseCard = () => {
    setNewCourse(true)
  }

  const hideNewCourseCard = () => {
    setNewCourseName("")
    setNewCourseGrade("")
    setNewCourse(false)
  }

  const handleFirstNameUpdate = (e) => {
    setFirstName(e.target.value)
  }
  const handleLastNameUpdate = (e) => {
    setLastName(e.target.value)
  }

  const handleStudentNameUpdate = (e) => {
    e.preventDefault()
    updateStudentInfo({
      id: +id,
      firstName: firstName || studentData?.data?.student.firstName,
      lastName: lastName || studentData?.data?.student.lastName,
    })
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

  useEffect(() => {
    if (studentData.data && !firstName) {
      setFirstName(studentData.data?.student.firstName)
      setLastName(studentData.data?.student.lastName)
    }
  }, [studentData.fetching])
  return (
    <Flex as="section" direction={{ base: "column", lg: "row" }} height="100vh" bg="bg-canvas" overflowY="auto">
      {isDesktop ? <Sidebar /> : <Navbar />}
      <Box bg="bg-surface" pt={{ base: "0", lg: "3" }} flex="1">
        <Box bg="bg-canvas" borderTopLeftRadius={{ base: "none", lg: "2rem" }} height="full">
          <Container py="8">
            <ImpersonateUserBanner />
            <Stack spacing={{ base: "8", lg: "6" }}>
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
                    <Box as="form" bg="bg-surface" boxShadow={useColorModeValue("sm", "sm-dark")} borderRadius="lg">
                      <Stack spacing="5" px={{ base: "4", md: "6" }} py={{ base: "5", md: "6" }}>
                        <Stack spacing="6" direction={{ base: "column", md: "row" }}>
                          <FormControl id="firstName">
                            <FormLabel>First Name</FormLabel>
                            <Input disabled={!user?.isAdmin} onChange={handleFirstNameUpdate} value={firstName} />
                          </FormControl>
                          <FormControl id="lastName">
                            <FormLabel>Last Name</FormLabel>
                            <Input disabled={!user?.isAdmin} onChange={handleLastNameUpdate} value={lastName} />
                          </FormControl>
                        </Stack>
                        {!user?.isAdmin ? null : (
                          <FormControl>
                            <Button variant={"primary"} onClick={handleStudentNameUpdate}>
                              Update
                            </Button>
                          </FormControl>
                        )}
                      </Stack>
                    </Box>
                  ) : null}
                  {!newCourse && studentData.data.student ? null : <EditStudentCard name={newCourseName} grade={newCourseGrade} feedback={null} id={null} student={id} teacher={user.id} teacherName={user.name} hideNewCourseCard={hideNewCourseCard} />}

                  {!fetching && !studentData.fetching && coursesData.courses && coursesData.courses.length != 0 ? (
                    coursesData.courses.map((course) => (
                      <EditStudentCard key={course.id} name={course.name} grade={course.grade} id={course.id} student={id} teacher={user.id} teacherName={user.name} feedback={course.feedback} hideNewCourseCard={hideNewCourseCard} />
                    ))
                  ) : (
                    <EditStudentCard name={newCourseName} grade={newCourseGrade} id={null} feedback={null} student={id} teacher={user.id} teacherName={user.name} hideNewCourseCard={hideNewCourseCard} />
                  )}
                </Stack>
              )}
            </Stack>
          </Container>
        </Box>
      </Box>
    </Flex>
  )
}

export default EditStudent
