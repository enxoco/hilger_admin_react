import { Box, Button, Flex } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import router from 'next/router';
import React from 'react';
import { Sidebar } from 'src/components/Sidebar';
import { InputField } from '../../../components/inputField';
import { Layout } from '../../../components/Layout';
import { useUpdatePostMutation } from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { useGetPostFromUrl } from '../../../utils/useGetPostFromUrl';

const EditPost = ({}) => {
    const [{ data, error, fetching }] = useGetPostFromUrl()
    const [,updatePost] = useUpdatePostMutation()
    
    if (error) {
        return (
            <Layout><Box>{ error.message }</Box></Layout>
        )
    }
    if (fetching) {
        return(
            <Layout><div>loading...</div></Layout>
        )
    }
    
        return (
            <Layout variant="small">
                <Flex direction="row">
                <Sidebar />
                <Formik initialValues={{title: data?.post?.title, text: data?.post?.text}}
            onSubmit={async (values, ) => {
                await updatePost({id: data?.post?.id, ...values})
                await router.back()

            }}>
                {({values, handleChange, isSubmitting}) => (
                    <Form>
                        <InputField name="title" placeholder="title" label="title" />
                        <Box mt={4}>
                        <InputField textarea name="text" label="body" />
                        <Button mt={4} type="submit" isLoading={isSubmitting} colorScheme="teal">Update Post</Button>

                        </Box>
                    </Form>
                )}
            </Formik>
                </Flex>

        </Layout>
        );
}

export default withUrqlClient(createUrqlClient)(EditPost)