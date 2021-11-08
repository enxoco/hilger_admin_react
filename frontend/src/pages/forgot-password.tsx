import { Box, Flex, Link, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import router from 'next/dist/client/router';
import React, { useState } from 'react'
import { InputField } from '../components/inputField';
import { Wrapper } from '../components/Wrapper';
import { useForgotPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';
import login from './login';

const ForgotPassword: React.FC<{}> = ({}) => {
    const [complete, setComplete] = useState(false)
    const [, forgotPassword] = useForgotPasswordMutation()
        return (
            <Wrapper>

            <Formik initialValues={{email: ""}}
            onSubmit={async (values) => {
                await forgotPassword(values)
                setComplete(true)
            }}>
                {({isSubmitting}) => complete ? <Box>if an account with that email exists, we sent you an email</Box> : (
                    <Form>
                        <InputField name="email" placeholder="email" label="Email" type="email" />
                        <Button mt={4} type="submit" isLoading={isSubmitting} colorScheme="teal">forgot password</Button>
                    </Form>
                )}
            </Formik>
            </Wrapper>
            );
}

export default withUrqlClient(createUrqlClient)(ForgotPassword)