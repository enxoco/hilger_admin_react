import { Button, IconButton } from "@chakra-ui/button"
import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { Box, Flex, Heading, Link, Stack, Text } from "@chakra-ui/layout"
import { withUrqlClient } from "next-urql"
import NextLink from "next/link"
import React, { useState } from "react"
import { EditDeletePostButtons } from "../components/EditDeletePostButtons"
import { Layout } from "../components/Layout"
import { UpvoteSection } from "../components/UpvoteSection"
import { useDeletePostMutation, DeletePostDocument, useMeQuery, useStudentsQuery, useCoursesQuery } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"

const Index = () => {
  const [variables, setVariables] = useState({ limit: 15, cursor: null as null | string })
  const [{ data, fetching }] = useStudentsQuery({
    variables,
  })
  const [{data: meData}] = useMeQuery()

  console.log('data', data)

  if (!fetching && !data) {
    return <div>you got no students for some reason</div>
  }
  return (
    <Layout>
      {fetching && !data ? (
        <div>loading...</div>
      ) : (
        <Stack>
          {data!.students.students.map((p) => !p ? null :(
            <Flex key={p.id} p={5} shadow="md" borderWidth="1px" >
              
              <Box flex={1} >
                <NextLink href="/student/[id]" as={`/student/${p.id}`}>
                  <Link>
                    <Heading fontSize="xl">{p.firstName} {p.lastName}</Heading>
                  </Link>
                </NextLink>

              </Box>
            </Flex>
          ))}
        </Stack>
      )}
      {data && data.students.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.students.students[data.students.students.length - 1].createdAt,
              })
            }}
            isLoading={fetching}
            m="auto"
            my={5}>
            load more
          </Button>
        </Flex>
      ) : (
        "that's all folks..."
      )}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: false })(Index)
