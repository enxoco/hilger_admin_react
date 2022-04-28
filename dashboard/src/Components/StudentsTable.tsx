import { Box, Link, Flex, Button, Heading, Badge, Table, TableCaption, Tbody, Td, Tr } from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import NextLink from "next/link"
import { useMeQuery, useLogoutMutation, useMyCoursesQuery, Student } from "../generated/graphql"
import { isServer } from "../utils/isServer"
import { useRouter } from "next/router"
import GlobalContext from "../utils/globalContext"
interface StudentsTableProps {
  students: Student[]
}

export const StudentsTable: React.FC<StudentsTableProps> = ({ students }) => {
  return (
      <>
      
    <Box p={2} borderRadius={5} borderWidth={2} boxShadow="sm" maxH={500} overflow="scroll" >
      <Table>
        <Tbody>
          {students && students.length != 0
            ? students.map((student) => (
                <Tr key={student.id}>
                  <Td>
                    <NextLink href="/student/[id]" as={`/student/${student.id}`}>
                      <Link style={{ cursor: "pointer" }}>
                        {student.firstName} {student.lastName}
                      </Link>
                    </NextLink>
                  </Td>
                </Tr>
              )): null}
        </Tbody>
      </Table>
    </Box>
    </>
  )
}
