import { Box, Heading } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react'
import { EditDeletePostButtons } from '../../components/editDeletePostButtons';
import { Layout } from '../../components/Layout';
import { usePostQuery } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';

export const Post = ({}) => {
    const router = useRouter()
    const intId = typeof router.query.id === 'string' ? +router.query.id : -1
    const [{data, error, fetching}] = usePostQuery({
        pause: intId === -1, // If we don't have an id, then stop the query.
        variables: {
            id: intId
        }
        
    })

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
    
    if (!data?.post) {
        return(
            <Layout>
                <Box>could not find post</Box>
            </Layout>
        )
    }
        return (
            <Layout>
                <Heading mb={4}>{data.post.title}</Heading>
                {data.post?.text}
                <EditDeletePostButtons id={data.post.id} creatorId={data.post.creator.id} />
            </Layout>
        );
}

export default withUrqlClient(createUrqlClient, {ssr: true})(Post)