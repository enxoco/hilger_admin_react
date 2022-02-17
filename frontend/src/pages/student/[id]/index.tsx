import { Box, Heading, IconButton, Link, Text, Flex } from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons"

import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react'
import { EditDeletePostButtons } from '../../../components/editDeletePostButtons';
import { Layout } from '../../../components/Layout';
import { usePostQuery } from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import {useCoursesQuery} from '../../../generated/graphql'
import NextLink from "next/link"

export const Post = ({}) => {
    const router = useRouter()
    const intId = typeof router.query.id === 'string' ? +router.query.id : -1
    const [{data, error, fetching}] = useCoursesQuery({
        pause: intId === -1, // If we don't have an id, then stop the query.
        variables: {
            limit: 100,
            student: intId
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
    console.log('data', data)
    if (!data?.courses) {
        return(
            <Layout>
                <Box>could not find post</Box>
            </Layout>
        )
    }
    const courseList = data.courses.courses
        return (
            <Layout>
                <Heading mb={4}>{data.courses.student[0].firstName} {data.courses.student[0].lastName}</Heading>

                <Flex>
                <Heading>Courses:</Heading>
                <NextLink href="/student/[id]/add-course" as={`/student/${data.courses.student[0].id}/add-course`}>
                    <IconButton as={Link} icon={<AddIcon />} aria-label="add course" mr={4} ml={5} />
                </NextLink>
                </Flex>
                {courseList.map((course, index) => {
                    return (
                    <li key={course.id}>{course.courseName} - {course.id} 
                              <NextLink href="/course/edit/[id]" as={`/course/edit/${course.id}`}>
                                <IconButton as={Link} icon={<EditIcon />} aria-label="edit course" mr={4} />
                            </NextLink>
                    </li>
                    )
                })}
            </Layout>
        );
}

export default withUrqlClient(createUrqlClient, {ssr: true})(Post)