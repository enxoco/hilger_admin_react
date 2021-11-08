import { Box, Link, Flex, Button, Heading } from '@chakra-ui/react';
import React from 'react'
import NextLink from 'next/link'
import { useMeQuery, useLogoutMutation } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import {useRouter} from 'next/router'

interface NavbarProps {

}

export const Navbar: React.FC<NavbarProps> = ({}) => {
    const router = useRouter()
    const [{fetching: logoutFetching}, logout] = useLogoutMutation()
    const [{data, fetching}] = useMeQuery({
        pause: isServer()
    })
    let body = null

    if (fetching) {
        
    } else if (!data?.me) {
        body = (
            <>
                <NextLink href="login">
                    <Link  mr={2}>login</Link>
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
            <Button as={Link} mr={2}>create post</Button>
            </NextLink>
                {data.me.username}
                <Button onClick={async () => {
                    await logout()
                    router.reload()
                }} isLoading={logoutFetching} variant="link" ml={'auto'}>logout</Button></Box>

            </Flex>
        )
    }
        return (
            <Flex position="sticky" top={0} zIndex={1} bg="teal" p={4} align="center">
                <Flex maxW={800} align="center" m="auto" flex={1}>
                <NextLink href="/"> 
                    <Link>
                    <Heading>LiReddit</Heading>
                    </Link>
                </NextLink>
                <Box ml={"auto"}>
                {body}
                </Box>
                </Flex>

            </Flex>
        );
}