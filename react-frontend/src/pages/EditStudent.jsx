import { Box, Button, Container, Flex, FormControl, FormLabel, HStack, Input, Stack, Text, Tooltip, useBreakpointValue, useColorModeValue } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { FiDownloadCloud } from "react-icons/fi"
import { useParams } from "react-router-dom"
import { useRecoilState } from 'recoil'
import { courses as coursesAtom, loggedInUser } from '../atom'
import EditStudentCard from "../components/EditCourseCard"
import { ImpersonateUserBanner } from "../components/ImpersonatedUserBanner"
import { Navbar } from "../components/Navbar"
import { Sidebar } from "../components/Sidebar"
import { useCheckLoginQuery, useGetCoursesByStudentAndTeacherQuery, useGetStudentQuery } from "../generated/graphql"


const EditStudent = () => {

  const isDesktop = useBreakpointValue({ base: false, lg: true })
  const isMobile = useBreakpointValue({ base: true, md: false })
  let { id } = useParams()
  const [teacher, setTeacher] = useState(null)
  const [user, setUser] = useRecoilState(loggedInUser)
  const [me, executeMeQuery] = useCheckLoginQuery({pause: user})

  // If we are reloading page then we have no state


  const [{ data: coursesData, error, fetching }, getCourses] = useGetCoursesByStudentAndTeacherQuery({
    pause: !teacher,
    requestPolicy: 'cache-and-network',
    variables: {
      studentId: id,
      teacherId: teacher
    },
  })


  const [studentData, getStudent] = useGetStudentQuery({variables: {id}})


  const [newCourse, setNewCourse] = useState(null)
  const [newCourseName, setNewCourseName] = useState("")
  const [newCourseGrade, setNewCourseGrade] = useState("")
  const [courses, setCourses] = useRecoilState(coursesAtom)
  const showNewCourseCard = () => {
    setNewCourse(true)
  }

  const hideNewCourseCard = () => {
    setNewCourseName("")
    setNewCourseGrade("")
    setNewCourse(false)
  }

  useEffect(() => {
    if (!teacher && user && user.id) {
      setTeacher(user.id)

      console.log('user', user)
    }
  }, [user])

  useEffect(() => {
    if (!user && me.data) {
      setUser(me.data.authenticatedItem)
      setTeacher(me.data?.authenticatedItem.id)
    }
  },[me.fetching])
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
                </HStack>
              </Stack>
              {(!teacher || !studentData.data) ? (
                <>loading</>) : (
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
                            <Input disabled defaultValue={studentData.data.student.firstName || ""} />
                          </FormControl>
                          <FormControl id="lastName">
                            <FormLabel>Last Name</FormLabel>
                            <Input disabled defaultValue={studentData.data.student.lastName || ""} />
                          </FormControl>
                        </Stack>
                      </Stack>
                    </Box>
                  ) : null}
                  {!fetching && !studentData.fetching && coursesData.courses && coursesData.courses.length != 0
                    ? coursesData.courses.map((course) => (
                        <EditStudentCard key={course.id} name={course.name} grade={course.grade} id={course.id} student={id} teacher={user.id} teacherName={user.name} feedback={course.feedback} hideNewCourseCard={hideNewCourseCard} />
                      ))
                    : (<EditStudentCard name={newCourseName} grade={newCourseGrade} id={null} feedback={null} student={id} teacher={user.id} teacherName={user.name} hideNewCourseCard={hideNewCourseCard} />)}
                  {!newCourse && studentData.data.student ? null : <EditStudentCard name={newCourseName} grade={newCourseGrade} feedback={feedback} id={null} student={id} teacher={user.id} hideNewCourseCard={hideNewCourseCard} />}
                </Stack>
                )
              }

            </Stack>
          </Container>
        </Box>
      </Box>
    </Flex>
  )
}

export default EditStudent
