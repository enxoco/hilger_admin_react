import { Box } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { InputField } from '../../../components/inputField';
import { Layout } from '../../../components/Layout';
import { useCreateCourseMutation, useMeQuery } from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { useIsAuth } from '../../../utils/useIsAuth';

const CreateCourse: React.FC<{}> = ({}) => {
    const [{ data: whoAmI }] = useMeQuery()

    console.log('data', whoAmI.me.id)
    const router = useRouter()
    useIsAuth()
    const [, createCourse] = useCreateCourseMutation()

        return (
        <Layout variant="small">
            <Formik initialValues={{courseName: '', grade: '', feedback: ''}}
            onSubmit={async (values, ) => {
                values.studentId = parseInt(router.query.id)
                const {error} = await createCourse({input: values})
                if (!error) {
                    router.push("/")
                }
            }}>
                {({values, handleChange, isSubmitting}) => (
                    <Form>
                        <InputField name="courseName" placeholder="course name" label="course name" />
                        <InputField name="grade" placeholder="grade" label="grade" />
                        <InputField name="feedback" placeholder="feedback" label="feedback" />

                        <Box mt={4}>
                        <Button mt={4} type="submit" isLoading={isSubmitting} colorScheme="teal">Create Course</Button>

                        </Box>
                    </Form>
                )}
            </Formik>
        </Layout>
        );
}

export default withUrqlClient(createUrqlClient)(CreateCourse)