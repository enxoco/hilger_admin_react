import { Box } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { InputField } from '../components/inputField';
import { Layout } from '../components/Layout';
import { useCreateStudentMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useIsAuth } from '../utils/useIsAuth';

const CreateStudent: React.FC<{}> = ({}) => {
    const router = useRouter()
    useIsAuth()
    const [, createStudent] = useCreateStudentMutation()
        return (
        <Layout variant="small">
            <Formik initialValues={{firstName: '', lastName: ''}}
            onSubmit={async (values, ) => {
                const {error} = await createStudent({input: values})
                if (!error) {
                    router.push("/")
                }
            }}>
                {({values, handleChange, isSubmitting}) => (
                    <Form>
                        <InputField name="firstName" placeholder="first name" label="first name" />
                        <InputField name="lastName" placeholder="last name" label="last name" />
                        <Box mt={4}>
                        <Button mt={4} type="submit" isLoading={isSubmitting} colorScheme="teal">Create Student</Button>

                        </Box>
                    </Form>
                )}
            </Formik>
        </Layout>
        );
}

export default withUrqlClient(createUrqlClient)(CreateStudent)