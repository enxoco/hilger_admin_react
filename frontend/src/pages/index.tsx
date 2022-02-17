import { Flex, Heading } from "@chakra-ui/layout"
import {
  Input,
  Table, TableCaption, Tbody, Td, Tr
} from '@chakra-ui/react'
import { withUrqlClient } from "next-urql"
import React, { useState } from "react"
import { Layout } from "../components/Layout"
import { useMeQuery, useStudentsQuery } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"

const Index = () => {
  const [variables, setVariables] = useState()
  const [{ data, fetching }] = useStudentsQuery({
    variables,
  })
  
  if (!fetching && !data) {
    return <div>you got no students for some reason</div>
  } 

  const [searchTerm, setSearchTerm] = useState('')
  const [students, setStudents] = useState(data?.students || [])

  const handleChange = (e) => {
    setSearchTerm(e.target.value)

    setStudents(data?.students.filter(a => a.fullName.toLowerCase().includes(searchTerm.toLowerCase())))
  }
  return (
    <Layout>
      <Flex mb={4}>
      <Heading>Search</Heading>
      <Input type="text" name="search" placeholder="Search for student by name" value={searchTerm} onChange={handleChange} ml={4} mt={1} />

      </Flex>
      <Table>
          <TableCaption>Students</TableCaption>
        <Tbody>
        {students && students.length != 0 ? students.map((student) => (
            <Tr key={student.id}>
              <Td>{student.firstName} {student.lastName}</Td>
            </Tr>
          )) : 
          data?.students.map((student) => (
            <Tr key={student.id}>
              <Td>{student.firstName} {student.lastName}</Td>
            </Tr>
          ))}

        </Tbody>
        </Table>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: false })(Index)
