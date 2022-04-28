import { Box, Button, Container, Flex } from "@chakra-ui/react"
import { ErrorMessage, Form, Formik } from "formik"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/dist/client/router"
import React from "react"
import { Navbar } from "src/components/Navbar"
import { InputField } from "../components/inputField"
import { Wrapper } from "../components/Wrapper"
import { useRegisterMutation } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"
import { toErrorMap } from "../utils/toErrorMap"
import { Text } from "@chakra-ui/react"

interface registerProps {}

export const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter()
  const [, register] = useRegisterMutation()
  return (
    <Wrapper>
      <Navbar />
      <Container mt={20}>
        <Formik
          initialValues={{ email: "", username: "", password: "", firstName: "", lastName: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await register({ options: values })
            if (response.data?.register.errors) {
              setErrors(toErrorMap(response.data.register.errors))
            } else if (response.data.register.user) {
              // worked
              router.push("/")
            }
          }}>
          {({ values, handleChange, isSubmitting, errors, touched }) => (
            <Box borderRadius={5} borderWidth={2} shadow="lg" p={5} textAlign="center">
              <Text fontSize="xl" mb={5} borderBottom="1px" borderBottomColor="gainsboro">Please create an account</Text>
              <Form mt={5}>
                <Flex direction="row">
                    <Box mr={5}>
                    <InputField name="firstName" placeholder="First Name" label="First Name" required/>
                        <ErrorMessage name="firstName" />
                    </Box>
                    <Box ml={5}>
                    <InputField name="lastName" placeholder="Last Name" label="Last Name" required/>
                    <ErrorMessage name="lastName" />

                    </Box>
                </Flex>
                <InputField name="username" placeholder="username" label="Username" />
                <ErrorMessage name="userName" />

                <Box mt={4}>
                  <InputField name="email" placeholder="email" label="Email" required />
                  <ErrorMessage name="email" />

                </Box>
                <Box mt={4}>
                  <InputField name="password" placeholder="password" label="Password" type="password" />
                  <ErrorMessage name="password" />

                  <Button mt={4} type="submit" isLoading={isSubmitting} colorScheme="teal">
                    Register
                  </Button>
                </Box>
              </Form>
            </Box>
          )}
        </Formik>
      </Container>
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(Register)
