import { EditIcon, DeleteIcon } from "@chakra-ui/icons"
import { Flex, IconButton, Link, Text } from "@chakra-ui/react"
import NextLink from "next/link"
import React from "react"
import { useDeletePostMutation, useMeQuery } from "../generated/graphql"

interface EditDeletePostButtonsProps {
  id: number,
  creatorId: number
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({ id, creatorId }) => {
  const [, deletePost] = useDeletePostMutation()
  const [{data: meData}] = useMeQuery()


  if (meData?.me?.id !== creatorId) {
    return null;
  }

    return (
      <Flex align="center" alignItems="center" justifyContent="center">
        <Flex ml="auto">
          <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
            <IconButton as={Link} icon={<EditIcon />} aria-label="edit post" mr={4} />
          </NextLink>
          <IconButton
            icon={<DeleteIcon />}
            aria-label="delete post"
            ml="auto"
            onClick={() => {
              deletePost({ id })
            }}
          />
        </Flex>
      </Flex>
    )

}
