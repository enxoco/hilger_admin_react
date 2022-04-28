import { Box } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { InputField } from '../components/inputField';
import { Layout } from '../components/Layout';
import { useCreateCourseMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useIsAuth } from '../utils/useIsAuth';

const CreateCourse: React.FC<{}> = ({}) => {
    const router = useRouter()
    useIsAuth()
    const [, createCourse] = useCreateCourseMutation()
        return (
        <Layout>
            
            <Formik initialValues={{courseName: '', grade: '', feedback: '', studentId: 0}}
            onSubmit={async (values, ) => {
                const {error} = await createCourse({input: values})
                if (!error) {
                    router.push("/")
                }
            }}>
                {({values, handleChange, isSubmitting}) => (
                <Box mt={20} borderRadius={5} borderWidth={2} shadow="lg" p={5} minW={450}>

                    <Form>
                        <InputField name="courseName" placeholder="course name" label="course name" />
                        <InputField name="grade" placeholder="grade" label="grade" />
                        <InputField name="feedback" placeholder="feedback" label="feedback" />
                        <InputField name="studentId" label="student id"/>
                        <InputField name="creatorId" label="teacher id" />

                        <Box mt={4}>
                        <Button mt={4} type="submit" isLoading={isSubmitting} colorScheme="teal">Create Course</Button>

                        </Box>
                    </Form>
                    </Box>

                )} 

            </Formik>
        </Layout>
        );
}

export default withUrqlClient(createUrqlClient)(CreateCourse)