import { Button, HStack, Input, Select, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import { matchSorter } from "match-sorter"
import * as React from "react"
import { IoArrowDown, IoArrowUp } from "react-icons/io5"
import { Link } from "react-router-dom"
import { useFilters, usePagination, useSortBy, useTable } from "react-table"
// Create an editable cell renderer
const EditableCell = ({ value: initialValue }) => {
  // We need to keep and update the state of the cell normally
  const [, setValue] = React.useState(initialValue)

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return `${initialValue}`
}
// Define a default UI for filtering
function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter } }) {
  const count = preFilteredRows.length

  return (
    <Input
      maxW="300px"
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} students...`}
    />
  )
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val
function StudentTable({ columns, data }) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id]
          return rowValue !== undefined ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase()) : true
        })
      },
    }),
    []
  )

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
      // And also our default editable cell
      Cell: EditableCell,
    }),
    []
  )

  // Use the state and functions returned from useTable to build your UI
  const initialState = {
    hiddenColumns: ['id', 'firstName', 'lastName']
  }
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      disableMultiSort: true,
      initialState
    },
    useFilters,
    useSortBy,
    usePagination
  )

  // Render the UI for your table
  return (
    <TableContainer>
      <Table {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => {
                console.log('column', column)
                return (
                <Th {...column.getHeaderProps()}>
                  <HStack spacing="1" {...column.getSortByToggleProps()}>
                    <Text mr={10}>{column.render("Header")}</Text>
                    {column.canFilter ? column.render("Filter") : null}
                    {column.canSort ? (
                      <Button>{column.isSorted ? column.isSortedDesc ? <IoArrowDown /> : <IoArrowUp /> : <IoArrowUp />}</Button>
                    ) : null}
                    

                  </HStack>
                </Th>
              )})}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row)
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <Td {...cell.getCellProps()}>
                    <Link to={`/student/${cell.row.values.id}`}>
                      
                    {cell.render("Cell", { editable: false })}

                    </Link>
                    </Td>
                })}
              </Tr>
            )
          })}
        </Tbody>
      </Table>

      <HStack className="pagination" mt={5}>
        <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </Button>{" "}
        <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </Button>{" "}
        <Button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </Button>{" "}
        <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </Button>{" "}
        <Text>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </Text>
        <Text>
          | Go to page:{" "}
          <Input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: "100px" }}
          />
        </Text>{" "}
        <Select
          maxW="200px"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
          }}>
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </Select>
      </HStack>
    </TableContainer>
  )
}
// function MemberTable({ studentProp, searchTerm }) {

//   return (
//     <>
//     <Box overflowX="auto">
//       {studentProp ? (
//         <TableContainer maxHeight="70vh" overflowY="scroll">
//           <Table overflow="scroll">
//             <Thead>
//               <Tr>
//                 <Th>
//                   <HStack spacing="3">
//                     <Checkbox />
//                     <HStack spacing="1">
//                       <Text>First Name</Text>
//                       <Button aria-label="sort" color="muted" onClick={handleFirstNameSort}>
//                         <Icon as={firstNameSort === "asc" ? IoArrowDown : IoArrowUp} color="muted" boxSize="4" />
//                       </Button>
//                     </HStack>
//                   </HStack>
//                 </Th>
//                 <Th>
//                   <HStack spacing="3">
//                     <HStack spacing="1">
//                       <Text>Last Name</Text>
//                       <Button aria-label="sort" color="muted" onClick={handleLastNameSort}>
//                         <Icon as={lastNameSort === "asc" ? IoArrowDown : IoArrowUp} color="muted" boxSize="4" />
//                       </Button>
//                     </HStack>
//                   </HStack>
//                 </Th>

//                 <Th></Th>
//               </Tr>
//             </Thead>
//             <Tbody>
//               {!studentProp
//                 ? null
//                 : studentProp.map((student) => {
//                     if (searchTerm == "" || student.name.toLowerCase().includes(searchTerm.toLowerCase())) {
//                       return (
//                         <Tr key={student.id}>
//                           <Td>
//                             <HStack spacing="3">
//                               <Checkbox />
//                               <Box>
//                                 <Link to={"/student/" + student.id}>
//                                   <Text fontWeight="medium">{student.firstName || student.name}</Text>
//                                 </Link>
//                               </Box>
//                             </HStack>
//                           </Td>
//                           <Td>
//                             <HStack spacing="3">
//                               <Box>
//                                 <Link to={"/student/" + student.id}>
//                                   <Text fontWeight="medium">{student.lastName || student.email}</Text>
//                                 </Link>
//                               </Box>
//                             </HStack>
//                           </Td>

//                           <Td>
//                             <HStack spacing="1">
//                               <IconButton icon={<FiTrash2 fontSize="1.25rem" />} variant="ghost" aria-label="Delete member" onClick={() => handleDelete(student.id)} />
//                               <Link to={"/student/" + student.id}>
//                                 <IconButton icon={<FiEdit2 fontSize="1.25rem" />} variant="ghost" aria-label="Edit member" />
//                               </Link>
//                             </HStack>
//                           </Td>
//                         </Tr>
//                       )
//                     }
//                   })}
//             </Tbody>
//           </Table>
//         </TableContainer>
//       ) : (
//         <>'Loading'</>
//       )}
//     </Box>
//                     <Box px={{ base: "4", md: "6" }} pb="5">
//                     <HStack spacing="3" justify="space-between">
//                       {studentProp && (
//                         <Text color="muted" fontSize="sm">
//                           Showing {pageOffset + 1} to { (filteredStudents && filteredStudents.length < (pageOffset + pageSize)) ? filteredStudents.length : (pageOffset + pageSize) } of {(filteredStudents) ? filteredStudents.length : (!studentsCount.fetching) ? studentsCount?.data?.studentsCount : null || null} results
//                         </Text>
//                       )}
//                       {studentProp && studentProp.length <= 10 ? null : (
//                         <ButtonGroup spacing="3" justifyContent="space-between" width={{ base: "full", md: "auto" }} variant="secondary">
//                           {(pageOffset > 1) ? (
//                           <Button value="previous" onClick={async () => await performPaginationPrevious()}>Previous</Button>

//                           ) : null}
//                           <Button value="next" onClick={() => performPaginationForward()}>Next</Button>
//                         </ButtonGroup>
//                       )}
//                     </HStack>
//                   </Box>
//                   </>
//   )
// }
export default StudentTable
