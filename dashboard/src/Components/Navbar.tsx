import { Box, Link, Flex, Button, Heading, Badge } from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import NextLink from "next/link"
import { useMeQuery, useLogoutMutation, useMyCoursesQuery } from "../generated/graphql"
import { isServer } from "../utils/isServer"
import { useRouter } from "next/router"
import Image from 'next/image'

import GlobalContext from "../utils/globalContext"
interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const router = useRouter()
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation()
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  })
  const [{ data: courses, fetching: fetchingCourses }] = useMyCoursesQuery({
    pause: !data?.me,
    variables: {
      id: data?.me?.id,
      type: "teacher"
    },
  })

  let body = null
  const global = useContext(GlobalContext)

  useEffect(() => {
    if (global.teacher && global.teacher.id == null && courses && data?.me.id) {
      let myStudents = []
      courses?.myCourses.map((student) => {
        myStudents.push({
          fullName: student.student.fullName,
          id: student.student.id,
        })
      })

      myStudents = myStudents.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
      global.update({
        teacher: {
          id: data?.me.id,
          fullName: data?.me.fullName,
          isAdmin: data?.me.isAdmin
        },
        myStudents: [...myStudents],
      })
    }
  })

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
          <Badge mx={5}>{global.teacher.fullName || ""} </Badge>

          <NextLink href="/create-student">
            <Button bg="#D3E4CD" color="#333" as={Link} mr={2}>
              add student
            </Button>
          </NextLink>

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
    <Flex position="sticky" top={0} zIndex={1} bg="white" p={4} align="center" boxShadow="md">
      <Flex align="center" m="auto" flex={1}>
        <NextLink href="/">
          <Link>
          <Flex alignItems="center" ml={5}>
          <Image src="https://hhlearning.com/wp-content/uploads/2017/04/cropped-HH-Logo.png" alt="Hilger Higher Learning" width={100} height={100}/>
            <Heading pl={5} color="#333">
              Hilger Higher Learning
            </Heading>
          </Flex>

          </Link>
        </NextLink>
        <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  )
}
