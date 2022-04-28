import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons"
import { Flex } from "@chakra-ui/layout"
import { IconButton } from "@chakra-ui/react"
import React, { useState } from "react"
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql"

interface UpvoteSectionProps {
  post: PostSnippetFragment
}

export const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<'upvote-loading' | 'downvote-loading' | 'not-loading'>('not-loading')
  const [, vote] = useVoteMutation()
  return (
    <Flex direction="column" alignItems="center" mr={5} justifyContent="center">
      <IconButton
        onClick={async () => {
          setLoadingState('upvote-loading')
          await vote({
            postId: post.id,
            value: 1,
          })
          setLoadingState('not-loading')
        }}
        icon={<ChevronUpIcon />}
        aria-label="upvote post"
        isLoading={loadingState == "upvote-loading"}
        color={post.voteStatus === 1 ? "green" : undefined}
        disabled={post.voteStatus === 1}
      />

      {post.points}

      <IconButton
        onClick={async () => {
          setLoadingState('downvote-loading')
          await vote({
            postId: post.id,
            value: -1,
          })
          setLoadingState('not-loading')
        }}
        icon={<ChevronDownIcon />}
        aria-label="downvote post"
        isLoading={loadingState == "downvote-loading"}
        color={post.voteStatus === -1 ? "red" : undefined}
        disabled={post.voteStatus === -1}

      />
    </Flex>
  )
}
