import { Button } from '@chakra-ui/button';
import { Box, Flex } from '@chakra-ui/layout';
import { Form, Formik } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/dist/client/router';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { InputField } from '../../components/inputField';
import { Wrapper } from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';
export const ChangePassword: NextPage<{token: string}> = () => {
    const router = useRouter()
    const [,changePassword] = useChangePasswordMutation()
    const [tokenError, setTokenError] = useState('')
        return (
            <Wrapper>

            <Formik initialValues={{newPassword: ''}}
            onSubmit={async (values, {setErrors}) => {
                const response = await changePassword({
                    newPassword: values.newPassword,
                    token: typeof router.query.token === "string" ? router.query.token : ""
                })
                if (response.data?.changePassword.errors){
                    const errorMap = toErrorMap(response.data?.changePassword.errors)
                    if ('token' in errorMap) {
                        setTokenError(errorMap.token)
                    } 
                    setErrors(errorMap)
                } else if (response.data?.changePassword.user) {
                    // worked
                    router.push("/")
                }
            }}>
                {({values, handleChange, isSubmitting}) => (
                    <Form>
                        <InputField name="newPassword" placeholder="new password" label="New Password" type="password" />
                        {tokenError ? (
                            <Flex>
                            <Box>
                                <Box mt={4} mr={4} color='red'>{tokenError}</Box>    
                                <NextLink href="/forgot-password">
                                get new reset token
                                </NextLink>
                            </Box>
                            </Flex>
                        ) : null}
                        <Button mt={4} type="submit" isLoading={isSubmitting} colorScheme="teal">Change password</Button>
                    </Form>
                )}
            </Formik>
            </Wrapper>
        )
}

// Get token from query.  Only needed for server side rendering.
// ChangePassword.getInitialProps = ({query}) => {
//     return {
//         token: query.token as string
//     }
// }

export default withUrqlClient(createUrqlClient)(ChangePassword)