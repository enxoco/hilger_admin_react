import { Button, IconButton } from "@chakra-ui/button"
import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { Box, Flex, Heading, Link, Stack, Text } from "@chakra-ui/layout"
import { withUrqlClient } from "next-urql"
import NextLink from "next/link"
import React, { useState } from "react"
import { EditDeletePostButtons } from "../components/editDeletePostButtons"
import { Layout } from "../components/Layout"
import { UpvoteSection } from "../components/UpvoteSection"
import { usePostsQuery, useDeletePostMutation, DeletePostDocument, useMeQuery } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"

const Index = () => {
  const [variables, setVariables] = useState({ limit: 15, cursor: null as null | string })
  const [{ data, fetching }] = usePostsQuery({
    variables,
  })
  const [{data: meData}] = useMeQuery()

  

  if (!fetching && !data) {
    return <div>you got no posts for some reason</div>
  }
  return (
    <Layout>
      {fetching && !data ? (
        <div>loading...</div>
      ) : (
        <Stack>
          {data!.posts.posts.map((p) => !p ? null :(
            <Flex key={p.id} p={5} shadow="md" borderWidth="1px" >
              <UpvoteSection post={p} />
              
              <Box flex={1} >
                <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                  <Link>
                    <Heading fontSize="xl">{p.title}</Heading>
                  </Link>
                </NextLink>
                <Text my={2} mr="auto">
                  posted by {p.creator.username}
                </Text>
                <Text>{p.textSnippet}</Text>
                <EditDeletePostButtons id={p.id} creatorId={p.creator.id}/>
              </Box>
            </Flex>
          ))}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
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
