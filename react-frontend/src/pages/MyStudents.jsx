import { Box, Button, ButtonGroup, Container, Flex, HStack, Icon, Input, InputGroup, InputLeftElement, Stack, Text, useBreakpointValue } from "@chakra-ui/react"
import * as React from "react"
import { useContext, useEffect, useState } from "react"
import { FiDownloadCloud, FiSearch } from "react-icons/fi"
import { Link, useParams } from "react-router-dom"
import MemberTable from "../components/MemberTable"
import { Navbar } from "../components/Navbar"
import { Sidebar } from "../components/Sidebar"
import { useDeleteStudentMutation, useGetMyStudentsQuery, useStudentsCountQuery } from "../generated/graphql"
import { useIsAuth } from "../utils/useIsAuth"
import { useRecoilState } from "recoil"
import { students as studentAtom, searchTerm as searchTermAtom, pageSize as pageSizeAtom, pageOffset as pageOffsetAtom } from "../atom"
import dynamicSort from "../utils/dynamicSort"
const MyStudents = () => {
  useIsAuth()
  const { id } = useParams()
  const isDesktop = useBreakpointValue({ base: false, lg: true })
  const isMobile = useBreakpointValue({ base: true, md: false })

  const [_, deleteStudent] = useDeleteStudentMutation()
  const [pageSize, setPageSize] = useRecoilState(pageSizeAtom)
  const [pageOffset, setPageOffset] = useRecoilState(pageOffsetAtom)
  const [students, setStudents] = useRecoilState(studentAtom)
  const [searchTerm, setSearchTerm] = useRecoilState(searchTermAtom)

  const [studentData, getStudents] = useGetMyStudentsQuery({variables: {id}, requestPolicy: 'network-only'})

  const [studentsCount] = useStudentsCountQuery()



  function performPaginationForward() {
    setPageOffset(pageSize + pageOffset)
    getStudents()
  }
  // const performPagination = () => {

  //     setPageOffset(pageSize + pageOffset)
    
  //   await getStudents({limit: pageSize, offset: pageOffset})
  // }

  function performPaginationPrevious() {

    console.log('pagesize and offset', pageSize, pageOffset)
    console.log('next offset', (pageSize - pageOffset))
    let offset = (pageOffset - pageSize)
      setPageOffset(offset)

    getStudents({limit: pageSize, offset: pageOffset})
  }
  useEffect(() => {
    if (studentData && studentData.data && studentData.data.user.students) {
      const studentArr = JSON.parse(studentData.data.user.students).sort(dynamicSort("firstName"))

      setStudents(studentArr)

    }

  }, [studentData.fetching])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }
  return (
    <Flex as="section" direction={{ base: "column", lg: "row" }} height="100vh" bg="bg-canvas" overflowY="auto">
      {isDesktop ? <Sidebar /> : <Navbar />}
      <Box bg="bg-surface" pt={{ base: "0", lg: "3" }} flex="1">
        <Box bg="bg-canvas" borderTopLeftRadius={{ base: "none", lg: "2rem" }} height="full">
          <Container py="8">
            <Stack spacing={{ base: "8", lg: "6" }}>
              <Stack spacing="4" direction={{ base: "column", lg: "row" }} justify="space-between" align={{ base: "start", lg: "center" }}>
                <HStack spacing="3">
                  <Button variant="secondary" leftIcon={<FiDownloadCloud fontSize="1.25rem" />}>
                    Export
                  </Button>
                  <Link to="/add-student">
                    <Button variant="primary">Add Student</Button>
                  </Link>
                </HStack>
              </Stack>

              <Stack spacing="5">
                <Box px={{ base: "4", md: "6" }} pt="5">
                  <Stack direction={{ base: "column", md: "row" }} justify="space-between">
                    <Text fontSize="lg" fontWeight="medium">
                      Students
                    </Text>
                    <InputGroup maxW="xs">
                      <InputLeftElement pointerEvents="none">
                        <Icon as={FiSearch} color="muted" boxSize="5" />
                      </InputLeftElement>
                      <Input placeholder="Search" onChange={handleSearch} />
                    </InputGroup>
                  </Stack>
                </Box>
                <Box overflowX="auto">
                  <MemberTable studentProp={students}/>
                </Box>
                <Box px={{ base: "4", md: "6" }} pb="5">
                  <HStack spacing="3" justify="space-between">
                    {!isMobile && students && (
                      <Text color="muted" fontSize="sm">
                        Showing {(students.length > 0) ? '1' : '0'} to {students.length} of {students.length || null} results
                      </Text>
                    )}
                    {students && students.length <= 10 ? null : (
                      <ButtonGroup spacing="3" justifyContent="space-between" width={{ base: "full", md: "auto" }} variant="secondary">
                        {(pageOffset > 1) ? (
                        <Button value="previous" onClick={async () => await performPaginationPrevious()}>Previous</Button>

                        ) : null}
                        <Button value="next" onClick={() => performPaginationForward()}>Next</Button>
                      </ButtonGroup>
                    )}
                  </HStack>
                </Box>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Box>
    </Flex>
  )
}

export default MyStudents
