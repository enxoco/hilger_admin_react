import { Box } from "@chakra-ui/layout"
import { Button } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/dist/client/router"
import React from "react"
import { Card } from "src/components/elements/Card"
import { InputField } from "../components/inputField"
import { Layout } from "../components/Layout"
import { useCreateStudentMutation } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"
import { useIsAuth } from "../utils/useIsAuth"

const CreateStudent: React.FC<{}> = ({}) => {
  const router = useRouter()
  useIsAuth()
  const [, createStudent] = useCreateStudentMutation()
  return (
    <Layout>
      <Formik
        initialValues={{ firstName: "", lastName: "" }}
        onSubmit={async (values) => {
          const { error } = await createStudent({ input: values })
          if (!error) {
            router.push("/")
          }
        }}>
        {({ values, handleChange, isSubmitting }) => (
          <Card>
            <Form>
              <InputField name="firstName" placeholder="First name" label="First name" />
              <InputField name="lastName" placeholder="Last name" label="Last name" />
              <Box mt={4}>
                <Button mt={4} type="submit" isLoading={isSubmitting} colorScheme="teal">
                  Create Student
                </Button>
              </Box>
            </Form>
          </Card>
        )}
      </Formik>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(CreateStudent)
