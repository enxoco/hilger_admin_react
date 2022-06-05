import { InfoIcon } from "@chakra-ui/icons"
import { Box, Button, HStack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr } from "@chakra-ui/react"
import * as React from "react"
import { Link } from "react-router-dom"
import { useRecoilState } from "recoil"
import { loggedInUser as loggedInUserAtom } from "../atom"
// Create an editable cell renderer

function SimpleTable({ studentProp, searchTerm }) {
  const [loggedInUser] = useRecoilState(loggedInUserAtom)

  return (
    <>
      <Box overflowX="auto" width="100%">
        {studentProp ? (
          <TableContainer maxHeight="70vh" overflowY="scroll">
            <Table overflow="scroll">
              <Thead>
                <Tr>
                  <Th></Th>

                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {!studentProp
                  ? null
                  : studentProp.map((student) => {
                      return (
                        <Tr key={student.id}>
                          <Td>
                            <HStack spacing="3">
                              <Box>
                                {loggedInUser?.isParent && !loggedInUser?.hasPaidTuition ? (
                                  <Text fontWeight="medium">{student.name || student.firstName || student.name}</Text>
                                ) : (
                                  <Link to={"/student/" + student.id + "/report"}>
                                    <Text fontWeight="medium">{student.name || student.firstName || student.name}</Text>
                                  </Link>
                                )}

                                {!loggedInUser?.isParent ? (
                                  <Link to={"/student/" + student.id}>
                                    <Text fontWeight="medium">{student.name || student.firstName || student.name}</Text>
                                  </Link>
                                ) : null}
                              </Box>
                            </HStack>
                          </Td>

                          <Td>
                            {loggedInUser?.hasPaidTuition ? (
                              <Link to={"/print-reports.php?student=" + student.id}>
                                  <Button variant="primary" data-action="view-grades">View Grades</Button>
                              </Link>
                            ) : (
                              <Tooltip label="It looks like you have an unpaid balance.">
                                <InfoIcon />
                              </Tooltip>
                            )}
                          </Td>
                        </Tr>
                      )
                    })}
              </Tbody>
            </Table>
          </TableContainer>
        ) : (
          <>'Loading'</>
        )}
      </Box>
    </>
  )
}
export default SimpleTable
