import { Box, Link, Flex, Button, Heading, Badge } from "@chakra-ui/react"
import React from "react"
import NextLink from "next/link"
import { useMeQuery, useLogoutMutation } from "../generated/graphql"
import { isServer } from "../utils/isServer"
import { useRouter } from "next/router"

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const router = useRouter()
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation()
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  })
  let body = null

  if (fetching) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="register">
          <Link color="black">register</Link>
        </NextLink>
      </>
    )
  } else {
    body = (
      <Flex>
        <Box>
          <NextLink href="/create-post">
            <Button bg="#D3E4CD" color="#333" as={Link} mr={2}>
              create post
            </Button>
          </NextLink>
          <Badge mx={5}> {data.me.username}</Badge>

          <Button
            as={Link}
            bgColor="#FFCCD2"
            onClick={async () => {
              await logout()
              router.reload()
            }}
            isLoading={logoutFetching}
            ml={"auto"}>
            logout
          </Button>
        </Box>
      </Flex>
    )
  }
  return (
    <Flex position="sticky" top={0} zIndex={1} bg="#FEF5ED" p={4} align="center" boxShadow="md">
      <Flex maxW={800} align="center" m="auto" flex={1}>
        <NextLink href="/">
          <Link>
            <Heading color="#333">Hilger Admin</Heading>
          </Link>
        </NextLink>
        <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  )
}
