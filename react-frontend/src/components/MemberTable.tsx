import { Box, Button, Checkbox, HStack, Icon, IconButton, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import * as React from "react"
import { useState } from "react"
import { FiEdit2, FiTrash2 } from "react-icons/fi"
import { IoArrowDown, IoArrowUp } from "react-icons/io5"
import { Link } from "react-router-dom"
import { useRecoilState } from "recoil"
import { searchTerm as searchTermAtom, students as studentAtom } from '../atom'
import {
  useDeleteStudentMutation
} from "../generated/graphql"

function MemberTable({studentProp, columns}) {
  const orderDirection = "asc"

  const [fetchStudents, setStudents] = useRecoilState(studentAtom)
  const [searchTerm, setSearchTerm] = useRecoilState(searchTermAtom)
  // No need to run our query if we already have students.

  const [_, deleteStudent] = useDeleteStudentMutation()
  const handleDelete = async (id) => {
    await deleteStudent({ id })
  }


  const [firstNameSort, setFirstNameSort] = useState("asc")
  const [lastNameSort, setLastNameSort] = useState("asc")
  function dynamicSort(property) {
    var sortOrder = 1;

    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a,b) {
        if(sortOrder == -1){
            return b[property].localeCompare(a[property]);
        }else{
            return a[property].localeCompare(b[property]);
        }        
    }
}
  const handleFirstNameAsc = async () => {
    let sorted = [...studentProp]
    setStudents(sorted.sort(dynamicSort("firstName")))
    setFirstNameSort('desc')
  }

  const handleFirstNameDesc = async () => {

    let sorted = [...studentProp]
    setStudents(sorted.sort(dynamicSort("-firstName")))
    setFirstNameSort('asc')
  }

  const handleLastNameAsc = async () => {

    let sorted = [...studentProp]
    setStudents(sorted.sort(dynamicSort("lastName")))
    setLastNameSort('desc')
  }

  const handleLastNameDesc = async () => {

    let sorted = [...studentProp]
    setStudents(sorted.sort(dynamicSort("-lastName")))
    setLastNameSort('asc')
  }

  const handleFirstNameSort = () => {
    if (firstNameSort == "asc") {
      handleFirstNameAsc()
    } else {
      handleFirstNameDesc()
    }
  }

  const handleLastNameSort = () => {
    if (lastNameSort == "asc") {
      handleLastNameAsc()
    } else {
      handleLastNameDesc()
    }
  }



  return (
    <>
    
    {(studentProp) ? (   
      <TableContainer maxHeight="70vh" overflowY="scroll">

    <Table overflow="scroll">
      <Thead>
        <Tr>
          <Th>
            <HStack spacing="3">
              <Checkbox />
              <HStack spacing="1">
                <Text>First Name</Text>
                <Button aria-label="sort" color="muted" onClick={handleFirstNameSort}>
                  <Icon as={firstNameSort === "asc" ? IoArrowDown : IoArrowUp} color="muted" boxSize="4" />
                </Button>
              </HStack>
            </HStack>
          </Th>
          <Th>
            <HStack spacing="3">
              <HStack spacing="1">
                <Text>Last Name</Text>
                <Button aria-label="sort" color="muted" onClick={handleLastNameSort}>
                  <Icon as={lastNameSort === "asc" ? IoArrowDown : IoArrowUp} color="muted" boxSize="4" />
                </Button>
              </HStack>
            </HStack>
          </Th>

          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {!studentProp
          ? null
          : studentProp.map((member) => { return (
              <Tr key={member.id}>
                <Td>
                  <HStack spacing="3">
                    <Checkbox />
                    <Box>
                    <Link to={"/student/" + member.id}>
                      <Text fontWeight="medium">{member.firstName || member.name}</Text>
                    </Link>
                    </Box>
                  </HStack>
                </Td>
                <Td>
                  <HStack spacing="3">
                    <Box>
                    <Link to={"/student/" + member.id}>
                      <Text fontWeight="medium">{member.lastName || member.email}</Text>
                    </Link>
                    </Box>
                  </HStack>
                </Td>

                <Td>
                  <HStack spacing="1">
                    <IconButton icon={<FiTrash2 fontSize="1.25rem" />} variant="ghost" aria-label="Delete member" onClick={() => handleDelete(member.id)} />
                    <Link to={"/student/" + member.id}>
                      <IconButton icon={<FiEdit2 fontSize="1.25rem" />} variant="ghost" aria-label="Edit member" />
                    </Link>

                  </HStack>
                </Td>
              </Tr>
            )})}
      </Tbody>
    </Table>
    </TableContainer> 
) : (<>'Loading'</>)}
    </>
  )
}
export default MemberTable
