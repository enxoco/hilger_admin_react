import React from 'react'
import {
    Button,
    Box,
    Flex,
    Link
  } from "@chakra-ui/react"
  import {Formik, Form} from 'formik'
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/inputField'
import { useLoginMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/dist/client/router';
import { withUrqlClient } from 'next-urql'
import { createUrqlClient } from '../utils/createUrqlClient';
import NextLink from 'next/link'
interface loginProps {

}

export const Login: React.FC<loginProps> = ({}) => {
    const router = useRouter()
    const [,login] = useLoginMutation()
        return (
            <Wrapper>

            <Formik initialValues={{usernameOrEmail: "", password: ""}}
            onSubmit={async (values, {setErrors}) => {
                const response = await login(values)
                if (response.data?.login.errors){
                    setErrors(toErrorMap(response.data.login.errors))
                } else if (response.data?.login.user) {
                    // redirect to previous page if available.
                    if (typeof router.query.next === "string") {
                        router.push(router.query.next)
                    } else {
                        router.push("/")
                    }
                    
                }
            }}>
                {({values, handleChange, isSubmitting}) => (
                    <Form>
                        <InputField name="usernameOrEmail" placeholder="username or email" label="Username or Email" />
                        <Box mt={4}>
                        <InputField name="password" placeholder="password" label="Password" type="password" />
                        <Flex mt="2">
                            <Link ml="auto" href="/forgot-password">
                                forgot password?
                            </Link>
                        </Flex>
                        <Button mt={4} type="submit" isLoading={isSubmitting} colorScheme="teal">Login</Button>

                        </Box>
                    </Form>
                )}
            </Formik>
            </Wrapper>
        );
}

export default withUrqlClient(createUrqlClient)(Login)