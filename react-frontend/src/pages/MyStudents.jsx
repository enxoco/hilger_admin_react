import { Box, Button, Divider, HStack, Icon, IconButton, Input, InputGroup, InputLeftElement, Stack, Text, Tooltip, useBreakpointValue } from "@chakra-ui/react"
import { useEffect, useMemo } from "react"
import { FiDownloadCloud, FiEdit2, FiSearch } from "react-icons/fi"
import { Link, useParams } from "react-router-dom"
import { useRecoilState } from "recoil"
import { loggedInUser as loggedInUserAtom, pageOffset as pageOffsetAtom, pageSize as pageSizeAtom, searchTerm as searchTermAtom, students as studentAtom } from "../atom"
import { Card } from "../components/Card"
import Layout from "../components/Layout"
import StudentTable from "../components/StudentTable"
import SimpleTable from "../components/SimpleTable"
import { useDeleteStudentMutation, useGetMyStudentsQuery, useGetStudentsByParentQuery, useStudentsCountQuery } from "../generated/graphql"
import { exportCSVFile } from "../utils/csvExport"
import dynamicSort from "../utils/dynamicSort"

const MyStudents = () => {
  const { id } = useParams()
  const isDesktop = useBreakpointValue({ base: false, lg: true })
  const isMobile = useBreakpointValue({ base: true, md: false })

  const [_, deleteStudent] = useDeleteStudentMutation()
  const [pageSize, setPageSize] = useRecoilState(pageSizeAtom)
  const [pageOffset, setPageOffset] = useRecoilState(pageOffsetAtom)
  const [students, setStudents] = useRecoilState(studentAtom)
  const [searchTerm, setSearchTerm] = useRecoilState(searchTermAtom)

  const [loggedInUser] = useRecoilState(loggedInUserAtom)
  const [studentData, getStudents] = useGetMyStudentsQuery({ variables: { id: loggedInUser?.id }, pause: loggedInUser && loggedInUser?.isParent, requestPolicy: 'cache-and-network'})

  const [childrenData, getChildren] = useGetStudentsByParentQuery({ variables: { email: loggedInUser?.email }, pause: loggedInUser && loggedInUser?.isTeacher })
  const [studentsCount] = useStudentsCountQuery()

  useEffect(() => {
    if (studentData && studentData.data && studentData.data.user.students) {
      const studentArr = JSON.parse(studentData.data.user.students)
        .sort(dynamicSort("firstName"))
        .filter((v, i, a) => a.findIndex((v2) => v2.id === v.id) === i)

      setStudents(studentArr)
    }
  }, [studentData.fetching])

  const columns = useMemo(
    () => [
      {
        Header: () => null,
        accessor: "id",
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
        id: "actions",
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleExport = () => {
    var headers = {
      id: "Id", // remove commas to avoid errors
      firstName: "First Name",
      lastName: "Last Name",
    }
    var itemsFormatted = []

    // format the data
    students.forEach((item) => {
      itemsFormatted.push({
        id: item.id, // remove commas to avoid errors,
        firstName: item.firstName,
        lastName: item.lastName,
      })
    })

    var fileTitle = "students-" + +new Date() // or 'my-unique-title'
    exportCSVFile(headers, itemsFormatted, fileTitle) // call the exportCSVFile() function to process the JSON and trigger the download
  }
  return (
    <Layout customTitle="My Students">
      <Stack spacing="4" direction={{ base: "column", lg: "row" }} justify="space-between" align={{ base: "start", lg: "center" }}>
        <HStack spacing="3">
          <Button variant="secondary" leftIcon={<FiDownloadCloud fontSize="1.25rem" />} onClick={handleExport}>
            Export
          </Button>
        </HStack>
      </Stack>

      <Stack spacing="5">

        <Box overflowX="auto">
          {!students?.length && !childrenData?.data?.students ? (
            <Card display={"flex"} justifyContent="center" alignItems={"center"} flexDir="column">
              <Text size="lg">You don't appear to have any grades entered yet.</Text>
              <Divider w="50%" my={10} />
              <Text>
                To start entering grades, click
                <Button variant={"link"}>
                  <Link to="/students" variant="link">
                    {" "}
                    here
                  </Link>{" "}
                </Button>
              </Text>
            </Card>
          ) : childrenData?.data?.students && loggedInUser?.isParent ? (
            <SimpleTable studentProp={childrenData?.data?.students} />
          ) : (
            <StudentTable columns={columns} data={students || childrenData?.data?.students} />
          )}
        </Box>
      </Stack>
    </Layout>
  )
}

export default MyStudents
