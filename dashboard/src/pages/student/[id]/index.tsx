import { AddIcon, ChevronRightIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Heading, IconButton, Link, Text } from "@chakra-ui/react"
import { withUrqlClient } from "next-urql"
import NextLink from "next/link"
import { useRouter } from "next/router"
import React, { useContext } from "react"
import { Card } from "src/components/elements/Card"
import { Sidebar } from "src/components/Sidebar"
import GlobalContext from "src/utils/globalContext"
import { Layout } from "../../../components/Layout"
import { useDeleteCourseMutation, useMyCoursesQuery } from "../../../generated/graphql"
import { createUrqlClient } from "../../../utils/createUrqlClient"

export const Post = ({}) => {
  const [, deletePost] = useDeleteCourseMutation()

  const router = useRouter()
  const intId = typeof router.query.id === "string" ? +router.query.id : -1
  const global = useContext(GlobalContext)

  const [{ data, error, fetching }] = useMyCoursesQuery({
    pause: intId === -1, // If we don't have an id, then stop the query.
    variables: {
      id: intId,
      type: "student",
    },
  })

  if (error) {
    return (
      <Layout>
        <Box>{error.message}</Box>
      </Layout>
    )
  }
  if (fetching) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    )
  }
  if (!data?.myCourses) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    )
  }
  const courseList = data.myCourses
  const isCurrentPage = true
  return (
    <Layout>
{/* <Box borderRadius={5} borderWidth={2} shadow="md">
<Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">All Students</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href={`/student/${courseList[0].student.id}`}>{courseList[0].student.fullName}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
</Box> */}
    <Card mt={10}>
    <Flex>
        <Heading ml={5} mb={4}>
          {courseList[0].student.fullName}
        </Heading>

        <NextLink href="/student/[id]/add-course" as={`/student/${courseList[0].student.id}/add-course`}>
          <IconButton as={Link} icon={<AddIcon />} aria-label="add course" mr={4} ml={5} />
        </NextLink>
      </Flex>

      <Flex>
        {courseList
          .filter((a) => a.teacher.id === global.teacher.id)
          .map((course) => (
            <Card maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" key={course.id} mx={5}>
              <Box p="6">
                <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
                  {" "}
                  {course.courseName} - {course.grade}
                </Box>
                <Text my={5} isTruncated>
                  {course.feedback}
                </Text>
                <Box color="gray.500" fontWeight="semibold" letterSpacing="wide" fontSize="xs" textTransform="uppercase" ml="2">
                  <NextLink href="/course/edit/[id]" as={`/course/edit/${course.id}`}>
                    <IconButton as={Link} icon={<EditIcon />} aria-label="edit course" mr={4} />
                  </NextLink>
                  <IconButton icon={<DeleteIcon />} aria-label="delete course" mr={4} ml={5} onClick={() => deletePost({ id: course.id })} />{" "}
                </Box>
              </Box>
            </Card>
          ))}
      </Flex>
    </Card>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: false })(Post)
