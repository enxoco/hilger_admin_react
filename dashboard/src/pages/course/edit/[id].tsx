import { Box, Button, Flex, Heading } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import { withUrqlClient } from "next-urql"
import router from "next/router"
import React from "react"
import { Sidebar } from "src/components/Sidebar"
import { InputField } from "../../../components/inputField"
import { Layout } from "../../../components/Layout"
import { useUpdateCourseMutation } from "../../../generated/graphql"
import { createUrqlClient } from "../../../utils/createUrqlClient"
import { useGetCourseFromUrl } from "../../../utils/useGetCourseFromUrl"

const EditCourse = ({}) => {
  const [{ data, error, fetching }] = useGetCourseFromUrl()
  const [, updateCourse] = useUpdateCourseMutation()

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

  return (
    <Layout>
      <Flex direction="row">
        <Sidebar />
        <Box borderRadius={5} shadow="md" borderWidth={1} p={10} maxH={700} mt={50} width={750}>
        <Heading>{data?.course?.student.fullName}</Heading>

          <Formik
            initialValues={{ courseName: data?.course?.courseName, grade: data?.course?.grade, feedback: data?.course?.feedback }}
            onSubmit={async (values) => {
              await updateCourse({ id: data?.course?.id, ...values })
              await router.back()
            }}>
            {({ values, handleChange, isSubmitting }) => (
              <Form>
                <InputField name="courseName" placeholder="title" label="Title" shadow="sm" />
                <InputField name="grade" placeholder="title" label="Grade" />

                <Box mt={4}>
                  <InputField textarea name="feedback" label="Feedback" height={300} />
                  <Button mt={4} type="submit" isLoading={isSubmitting} colorScheme="teal">
                    Update Course
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Flex>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(EditCourse)
