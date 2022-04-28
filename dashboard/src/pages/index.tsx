import { Box, Flex, Heading, Link } from "@chakra-ui/layout"
import { Button, Input, Table, TableCaption, Tbody, Td, Tr } from "@chakra-ui/react"
import { withUrqlClient } from "next-urql"
import React, { useContext, useEffect, useState } from "react"
import { Layout } from "../components/Layout"
import { useStudentsQuery } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"
import { Text } from "@chakra-ui/react"
import { Sidebar } from "../components/Sidebar"

import NextLink from "next/link"
import GlobalContext from "src/utils/globalContext"
import { StudentsTable } from "src/components/StudentsTable"

const Index = () => {
  const [variables, setVariables] = useState()
  const [{ data, fetching }] = useStudentsQuery({
    variables,
  })

  if (!fetching && !data) {
    return <div>you got no students for some reason</div>
  }

  const [searchTerm, setSearchTerm] = useState("")
  const [students, setStudents] = useState([])

  const handleChange = (e) => {
    setSearchTerm(e.target.value)

    setStudents(data?.students.filter((a) => a.fullName.toLowerCase().includes(searchTerm.toLowerCase())))
  }

  useEffect(() => {
    if (students.length == 0 && data?.students) {
      setStudents(data?.students)
    }
  })

  return (
    <Layout>
      <Box borderRadius={5} borderWidth={2} boxShadow={3} p={5} mt={5} w={600}>
        <Flex mb={4}>
          <Box>
            <Heading>Search</Heading>
            <Input type="text" name="search" placeholder="Search for student by name" value={searchTerm} onChange={handleChange} ml={4} mt={1} />
          </Box>

          <NextLink href="/create-student">
            <Button bg="#D3E4CD" color="#333" as={Link} mr={2}>
              export students
            </Button>
          </NextLink>
        </Flex>
        {!data?.students ? null : <StudentsTable students={students} />}
      </Box>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: false })(Index)
