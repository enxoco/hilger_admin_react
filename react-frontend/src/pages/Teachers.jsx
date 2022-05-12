import { Box, Button, ButtonGroup, Container, Flex, HStack, Icon, Input, InputGroup, InputLeftElement, Stack, Text, useBreakpointValue } from "@chakra-ui/react"
import * as React from "react"
import { useEffect } from "react"
import { FiDownloadCloud, FiSearch } from "react-icons/fi"
import { Link, useParams } from "react-router-dom"
import { useRecoilState } from "recoil"
import { pageOffset as pageOffsetAtom, pageSize as pageSizeAtom, searchTerm as searchTermAtom, students as studentAtom, impersonateUser as impersonateUserAtom, teachers as teachersAtom } from "../atom"
import { ImpersonateUserBanner } from "../components/ImpersonatedUserBanner"
import { Navbar } from "../components/Navbar"
import { Sidebar } from "../components/Sidebar"
import TeacherTable from "../components/TeacherTable"
import { useGetAllTeachersQuery } from "../generated/graphql"
import useDocumentTitle from "../utils/useDocumentTitle"
const Teachers = () => {
  useDocumentTitle('Hilger Portal - Teachers')
  const { id } = useParams()
  const isDesktop = useBreakpointValue({ base: false, lg: true })
  const isMobile = useBreakpointValue({ base: true, md: false })

  const [pageSize, setPageSize] = useRecoilState(pageSizeAtom)
  const [pageOffset, setPageOffset] = useRecoilState(pageOffsetAtom)
  const [students, setStudents] = useRecoilState(studentAtom)
  const [searchTerm, setSearchTerm] = useRecoilState(searchTermAtom)

  const [studentData, getStudents] = useGetAllTeachersQuery({variables: {limit: pageSize, offset: pageOffset}})

  const [teachers, setTeachers] = useRecoilState(teachersAtom)


  function performPaginationForward() {
    setPageOffset(pageSize + pageOffset)
    getStudents()
  }

  function performPaginationPrevious() {

    let offset = (pageOffset - pageSize)
      setPageOffset(offset)

    getStudents({limit: pageSize, offset: pageOffset})
  }
  useEffect(() => {
    if (!teachers && studentData && studentData.data) {
      const teachers = studentData?.data?.users?.filter(user => !user.isParent)
      setTeachers(studentData.data.users)
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
          <ImpersonateUserBanner />

            <Stack spacing={{ base: "8", lg: "6" }}>
              <Stack spacing="4" direction={{ base: "column", lg: "row" }} justify="space-between" align={{ base: "start", lg: "center" }}>
                <HStack spacing="3">
                  <Button variant="secondary" leftIcon={<FiDownloadCloud fontSize="1.25rem" />}>
                    Export
                  </Button>
                  <Link to="/add-teacher">
                    <Button variant="primary">Add Teacher</Button>
                  </Link>
                </HStack>
              </Stack>

              <Stack spacing="5">
                <Box px={{ base: "4", md: "6" }} pt="5">
                  <Stack direction={{ base: "column", md: "row" }} justify="space-between">
                    <Text fontSize="lg" fontWeight="medium">
                      Teachers
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
                  <TeacherTable studentProp={teachers} columns={["Name", "Email"]}/>
                </Box>
                <Box px={{ base: "4", md: "6" }} pb="5">
                  <HStack spacing="3" justify="space-between">
                    {!isMobile && teachers && (
                      <Text color="muted" fontSize="sm">
                        Showing {pageOffset + 1} to {pageOffset + pageSize} of {teachers.length|| null} results
                      </Text>
                    )}
                    {teachers && teachers.length <= 10 ? null : (
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

export default Teachers
