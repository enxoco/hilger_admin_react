import { Button, HStack, IconButton, Stack, Tooltip } from "@chakra-ui/react"
import { useMemo } from "react"
import { FiDownloadCloud, FiEdit2 } from "react-icons/fi"
import { Link } from "react-router-dom"

import Layout from "../components/Layout"
import StudentTable from "../components/StudentTable"
import { useGetAllStudentsQuery } from "../generated/graphql"
import { exportCSVFile } from "../utils/csvExport"
const Students = () => {
  const [studentData] = useGetAllStudentsQuery({ variables: { limit: 1000, offset: 0 } })

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

  const handleExport = () => {
    var headers = {
      id: "Id", // remove commas to avoid errors
      firstName: "First Name",
      lastName: "Last Name",
    }
    var itemsFormatted = []

    // format the data
    studentData?.data?.students.forEach((item) => {
      itemsFormatted.push({
        id: item.id, // remove commas to avoid errors,
        firstName: item.firstName,
        lastName: item.lastName,
      })
    })

    var fileTitle = "all-students_" + +new Date() // or 'my-unique-title'
    exportCSVFile(headers, itemsFormatted, fileTitle) // call the exportCSVFile() function to process the JSON and trigger the download
  }
  return (
    <Layout customTitle="All Students" description="">
      <Stack spacing="4" direction={{ base: "column", lg: "row" }} justify="space-between" align={{ base: "start", lg: "center" }}>
        <HStack spacing="3">
          <Button variant="secondary" leftIcon={<FiDownloadCloud fontSize="1.25rem" />} onClick={handleExport}>
            Export
          </Button>
          <Link to="/add-student">
            <Button variant="primary">Add Student</Button>
          </Link>
        </HStack>
      </Stack>

      <Stack spacing="5">
        <StudentTable columns={columns} data={studentData?.data?.students || []} />
      </Stack>
    </Layout>
  )
}

export default Students
