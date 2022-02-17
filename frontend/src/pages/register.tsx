import {
    Box, Button
} from "@chakra-ui/react";
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { InputField } from '../components/inputField';
import { Wrapper } from '../components/Wrapper';
import { useRegisterMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';

interface registerProps {

}

export const Register: React.FC<registerProps> = ({}) => {
    const router = useRouter()
    const [,register] = useRegisterMutation()
        return (
            <Wrapper>

            <Formik initialValues={{email: "", username: "", password: ""}}
            onSubmit={async (values, {setErrors}) => {
                const response = await register({options: values})
                if (response.data?.register.errors){
                    setErrors(toErrorMap(response.data.register.errors))
                } else if (response.data.register.user) {
                    // worked
                    router.push("/")
                    
                }
            }}>
                {({values, handleChange, isSubmitting}) => (
                    <Form>
                        <InputField name="username" placeholder="username" label="Username" />
                        <Box mt={4}>
                            <InputField name="email" placeholder="email" label="Email" />
                        </Box>
                        <Box mt={4}>
                        <InputField name="password" placeholder="password" label="Password" type="password" />
                        <Button mt={4} type="submit" isLoading={isSubmitting} colorScheme="teal">Register</Button>
                        </Box>
                    </Form>
                )}
            </Formik>
            </Wrapper>
        );
}

export default withUrqlClient(createUrqlClient)(Register)