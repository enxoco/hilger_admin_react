import { Box } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { InputField } from '../components/inputField';
import { Layout } from '../components/Layout';
import { useCreatePostMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useIsAuth } from '../utils/useIsAuth';

const CreatePost: React.FC<{}> = ({}) => {
    const router = useRouter()
    useIsAuth()
    const [, createPost] = useCreatePostMutation()
        return (
        <Layout variant="small">
            <Formik initialValues={{title: '', text: ''}}
            onSubmit={async (values, ) => {
                const {error} = await createPost({input: values})
                if (!error) {
                    router.push("/")
                }
            }}>
                {({values, handleChange, isSubmitting}) => (
                    <Form>
                        <InputField name="title" placeholder="title" label="title" />
                        <Box mt={4}>
                        <InputField textarea name="text" label="body" />
                        <Button mt={4} type="submit" isLoading={isSubmitting} colorScheme="teal">Create Post</Button>

                        </Box>
                    </Form>
                )}
            </Formik>
        </Layout>
        );
}

export default withUrqlClient(createUrqlClient)(CreatePost)