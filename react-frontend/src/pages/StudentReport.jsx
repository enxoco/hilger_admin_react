import { Box, Button, Container, Flex, FormControl, FormLabel, HStack, Input, Stack, Text, useBreakpointValue, useColorModeValue, Heading, VStack, Image, Divider } from "@chakra-ui/react"
import { useEffect, useState, useRef } from "react"
import { FiDownloadCloud } from "react-icons/fi"
import { useParams } from "react-router-dom"
import { useRecoilState } from "recoil"
import { courses as coursesAtom, loggedInUser } from "../atom"
import EditStudentCard from "../components/EditCourseCard"
import { Navbar } from "../components/Navbar"
import { Sidebar } from "../components/Sidebar"
import { useCoursesByStudentQuery, useGetStudentQuery, useCheckLoginQuery } from "../generated/graphql"
import ReactToPrint from "react-to-print"

const StudentReport = () => {
  const componentRef = useRef()
  const isDesktop = useBreakpointValue({ base: false, lg: true })
  const isMobile = useBreakpointValue({ base: true, md: false })
  let { id } = useParams()
  const [teacher, setTeacher] = useState(null)
  const [user, setUser] = useRecoilState(loggedInUser)
  const [me, executeMeQuery] = useCheckLoginQuery({ pause: user })

  // If we are reloading page then we have no state

  const [{ data: coursesData, error, fetching }, getCourses] = useCoursesByStudentQuery({
    pause: !id,
    variables: {
      studentId: id,
    },
  })
  const [coursesParsed, parseCourses] = useState(false)

  const pageStyle = `
  @page {
    size: 80mm 50mm;
  }

  @media all {
    .pagebreak {
      display: none;
    }
  }

  @media print {
    .pagebreak {
      page-break-before: always;
    }
  }
`;

  const [studentData, getStudent] = useGetStudentQuery({ variables: { id } })

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
    }
  }, [user])

  useEffect(() => {
    if (!user && me.data) {
      setUser(me.data.authenticatedItem)
      setTeacher(me.data?.authenticatedItem.id)
    }
  }, [me.fetching])


  useEffect(() => {
    if (coursesData && coursesData.courses) {
      // Map over our courses and add the feedback length for each one.  When we hit 200 characters
      // we will tell out template to add a line break of some sore.
      let courseLimit = 0
      for (const course of coursesData.courses.slice(1)) {
        courseLimit += +course.feedbackLength
        if (+courseLimit >= 2000) {
          course.feedbackLength = 'break'
          courseLimit = 0
        }
      }
      // This line is used in our component to make sure that we aren't rendering the list of courses
      // until we have added all of the needed page breaks.
      parseCourses(true)
    }
  }, [coursesData])

  return (
    <Flex as="section" direction={{ base: "column", lg: "row" }} height="100vh" bg="bg-canvas" overflowY="auto">
      {isDesktop ? <Sidebar /> : <Navbar />}
      <Box bg="bg-surface" pt={{ base: "0", lg: "3" }} flex="1">
        <Box bg="bg-canvas" borderTopLeftRadius={{ base: "none", lg: "2rem" }} height="full">
          <Container py="8">
            <Stack spacing={{ base: "8", lg: "6" }}>
              <Stack spacing="4" direction={{ base: "column", lg: "row" }} justify="space-between" align={{ base: "start", lg: "center" }}>
                <HStack spacing="3">
                  <Button variant="secondary" leftIcon={<FiDownloadCloud fontSize="1.25rem" />}>
                    Export
                  </Button>
                  <Button variant="primary" onClick={showNewCourseCard}>
                    Add Course
                  </Button>
                  <ReactToPrint trigger={() => <Button>Print</Button>} content={() => componentRef.current} />

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
                  {!fetching && loggedInUser && !studentData.fetching && coursesParsed ? (
                    <Box as="form" bg="bg-surface" boxShadow={useColorModeValue("sm", "sm-dark")} borderRadius="lg">

                      <VStack ref={componentRef} pageStyle={pageStyle} spacing="5" px={{ base: "4", md: "6" }} py={{ base: "5", md: "6" }}>
                        <HStack justifyContent={"space-between"}>
                          <Image src="https://hhlearning.com/wp-content/uploads/2017/04/cropped-HH-Logo.png" alt="Hilger Higher Learning Logo" height="175" width="175"/>
                          <Heading size="xs" textAlign="center">
                            Hilger Higher Learning Report Card Spring Semester 2022
                          </Heading>
                        </HStack>

                        <Text textAlign="center">
                          Hilger Higher Learning, Inc.
                          <br />
                          412 East and West Road
                          <br />
                          Lookout Mountain, TN 37350
                          <br />
                          www.hhlearning.com
                          <br />
                        </Text>
                        <Text>
                          {studentData.data.student.firstName} {studentData.data.student.lastName} has received the following percentage grade(s) for one semester of class(es) administered by Hilger Higher Learning, Inc. All instructors contracted by
                          Hilger Higher Learning meet proper Certification and/or requirement standards as directed by Tennessee, Georgia, and Alabama state law. Each semester of class is worth 1/2 credit.
                        </Text>

                        <VStack textAlign="left" alignItems="flexStart" mb="50" marginBottom={50} className="page-break">
                            <Text fontWeight="bold">Course: {coursesData.courses[0].name || null}</Text>
                            <Text fontWeight="bold">Grade: {coursesData.courses[0].grade || ""}</Text>
                            <Text fontWeight="bold">Instructor: {coursesData.courses[0].teacher.name}</Text>
                            <Text>{coursesData.courses[0].feedback}</Text>
                          </VStack>
                          <div className="print-only" style={{height: 275}}></div>
                          
                        {coursesData.courses.slice(1).map((course, index) =>                           
                        (
                            <>
                            <VStack textAlign="left" alignItems="flexStart" mb="50" marginBottom={50} className="page-break">
                              <Text fontWeight="bold">Course: {course.name || null}</Text>
                              <Text fontWeight="bold">Grade: {course.grade || ""}</Text>
                              <Text fontWeight="bold">Instructor: {course.teacher.name}</Text>
                              <Text>{course.feedback}</Text>
                            </VStack>
                            {(course.feedbackLength == "break") ? (<div className="print-only" style={{height: 275}}></div>) : null}
                            </>
  
                          ))}
                      </VStack>
                    </Box>
                  ) : null}
                </Stack>
              )}
            </Stack>
          </Container>
        </Box>
      </Box>
    </Flex>
  )
}

export default StudentReport
