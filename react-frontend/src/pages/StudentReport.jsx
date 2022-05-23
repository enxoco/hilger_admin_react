import { Box, Button, Heading, HStack, Image, Skeleton, Stack, Text, useColorModeValue, VStack } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import ReactToPrint from "react-to-print"
import { useRecoilState } from "recoil"
import { loggedInUser } from "../atom"
import Layout from "../components/Layout"
import { useCheckLoginQuery, useCoursesByStudentQuery, useGetStudentQuery } from "../generated/graphql"
import useDocumentTitle from "../utils/useDocumentTitle"
import Dashboard from "./Dashboard"

const StudentReport = () => {
  useDocumentTitle("Hilger Portal - Student Report")
  const componentRef = useRef()

  let { id } = useParams()
  const [teacher, setTeacher] = useState(null)
  const [user, setUser] = useRecoilState(loggedInUser)
  const [me] = useCheckLoginQuery({ pause: user })

  // If we are reloading page then we have no state

  const [{ data: coursesData, error, fetching }] = useCoursesByStudentQuery({
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
`

  const [studentData] = useGetStudentQuery({ variables: { id } })

  const getPageMargins = () => {
    return `@page { margin: 17mm 10mm !important;}`
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
      for (const course of coursesData.courses) {
        let feedback = course.feedback
      }
      for (const course of coursesData.courses.slice(1)) {
        courseLimit += +course.feedbackLength
        if (+courseLimit >= 2000) {
          course.feedbackLength = "break"
          courseLimit = 0
        }
      }
      // This line is used in our component to make sure that we aren't rendering the list of courses
      // until we have added all of the needed page breaks.
      parseCourses(true)
    }
  }, [coursesData])
  if (me.data?.authenticatedItem.isParent && !me.data?.authenticatedItem.hasPaidTuition) {
    return <Dashboard />
  }
  return (
    <Layout>
      <Stack spacing="4" direction={{ base: "column", lg: "row" }} justify="end" align={{ base: "start", lg: "center" }}>
        <HStack spacing="3">
          <ReactToPrint trigger={() => <Button variant={"primary"}>Print</Button>} content={() => componentRef.current} />
        </HStack>
      </Stack>
      <Skeleton isLoaded={studentData?.data}>
        <Stack spacing="5">
          {!fetching && loggedInUser && !studentData.fetching && coursesParsed ? (
            <Box as="form" bg="bg-surface" boxShadow={useColorModeValue("sm", "sm-dark")} borderRadius="lg">
              <VStack ref={componentRef} pagestyle={pageStyle} spacing="5" px={{ base: "4", md: "6" }} py={{ base: "5", md: "6" }}>
                <style>{getPageMargins()}</style>

                <HStack justifyContent={"space-between"}>
                  <Image src="https://hhlearning.com/wp-content/uploads/2017/04/cropped-HH-Logo.png" alt="Hilger Higher Learning Logo" height="175" width="175" />
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
                  {studentData.data.student.firstName} {studentData.data.student.lastName} has received the following percentage grade(s) for one semester of class(es) administered by Hilger Higher Learning, Inc. All instructors contracted by Hilger
                  Higher Learning meet proper Certification and/or requirement standards as directed by Tennessee, Georgia, and Alabama state law. Each semester of class is worth 1/2 credit.
                </Text>

                <VStack textAlign="left" alignItems="flexStart" mb="50" marginBottom={50} className="page-break">
                  <Text fontWeight="bold">Course: {coursesData.courses[0].name || null}</Text>
                  <Text fontWeight="bold">Grade: {coursesData.courses[0].grade || ""}</Text>
                  <Text fontWeight="bold">Instructor: {coursesData.courses[0].teacher.name}</Text>
                  <Text>{coursesData.courses[0].feedback}</Text>
                </VStack>

                {coursesData.courses.slice(1).map((course, index) => (
                  <>
                    <VStack textAlign="left" alignItems="flexStart" mb="50" marginBottom={50} className="page-break">
                      <Text fontWeight="bold">Course: {course.name || null}</Text>
                      <Text fontWeight="bold">Grade: {course.grade || ""}</Text>
                      <Text fontWeight="bold">Instructor: {course.teacher.name}</Text>
                      <Text>{course.feedback}</Text>
                    </VStack>
                  </>
                ))}
              </VStack>
            </Box>
          ) : null}
        </Stack>
      </Skeleton>
    </Layout>
  )
}

export default StudentReport
