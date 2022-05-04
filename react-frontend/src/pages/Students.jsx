import { Box, Button, Container, Flex, HStack, IconButton, Stack, Text, Tooltip, useBreakpointValue } from "@chakra-ui/react"
import * as React from "react"
import { useEffect } from "react"
import { FiDownloadCloud, FiEdit2 } from "react-icons/fi"
import { Link, useParams } from "react-router-dom"
import { useRecoilState } from "recoil"
import { students as studentAtom } from "../atom"
import StudentTable from "../components/MemberTable"
import { Navbar } from "../components/Navbar"
import { Sidebar } from "../components/Sidebar"
import { useDeleteStudentMutation, useGetAllStudentsQuery } from "../generated/graphql"

const Students = () => {
  const { id } = useParams()
  const isDesktop = useBreakpointValue({ base: false, lg: true })
  const isMobile = useBreakpointValue({ base: true, md: false })

  const [_, deleteStudent] = useDeleteStudentMutation()

  const [students, setStudents] = useRecoilState(studentAtom)

  const [studentData, getStudents] = useGetAllStudentsQuery({ variables: { limit: 1000, offset: 0 }, requestPolicy: "network-only" })

  useEffect(() => {
    if (!students && studentData && studentData.data) {
      setStudents(studentData.data.students)
      console.log("studentdata", studentData.data.students)
    }
  }, [studentData.fetching])

  const columns = React.useMemo(
    () => [

          {
            Header: () => null,
            accessor: 'id',
          },
          {
            Header: () => null,
            accessor: "firstName",
          },
          {
            Header: () => null,
            accessor: "lastName",
            filter: "fuzzyText",
          },
          {
            Header: "Name",
            accessor: "name",
            filter: "fuzzyText",
          },
          {
            Header: () => null,
            id: 'actions',
            filter: null,
            isSorted: true,
            Cell: ({ row }) => (
              // Use Cell to render an expander for each row.
              // We can use the getToggleRowExpandedProps prop-getter
              // to build the expander.
<>
<HStack spacing="1">
                    <Link to={"/student/" + row.values.id}>
                      <Tooltip label="Manage courses">
                      <IconButton icon={<FiEdit2 fontSize="1.25rem" />} variant="ghost" aria-label="Edit Course" />

                      </Tooltip>
                    </Link>

                  </HStack>
</>  
              
            ),
          },

    ],
    []
  )
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
                  </Stack>
                </Box>
                  <Box overflowX="auto">
                    <StudentTable columns={columns} data={students || [{id: 0, name: "", firstName: "", lastName: ""},{id: 0, name: "", firstName: "", lastName: ""},{id: 0, name: "", firstName: "", lastName: ""},{id: 0, name: "", firstName: "", lastName: ""},{id: 0, name: "", firstName: "", lastName: ""}]} />
                  </Box>
                
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Box>
    </Flex>
  )
}

export default Students
