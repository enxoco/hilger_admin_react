import { Box, Button, ButtonGroup, Container, Divider, Flex, FormControl, FormLabel, Heading, HStack, Icon, Input, InputGroup, InputLeftElement, SimpleGrid, Stack, Text, Textarea, useBreakpointValue, useColorModeValue } from "@chakra-ui/react"
import * as React from "react"
import { useContext, useState } from "react"
import { FiDownloadCloud, FiSearch } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { Card } from "../components/Card"
import { Navbar } from "../components/Navbar"
import { Sidebar } from "../components/Sidebar"
import { useCreateStudentMutation, useBulkAddStudentsMutation, StudentCreateInput } from "../generated/graphql"
import { useIsAuth } from "../utils/useIsAuth"
function AddStudent() {
  useIsAuth()
  const navigate = useNavigate()
  const isDesktop = useBreakpointValue({ base: false, lg: true })
  const isMobile = useBreakpointValue({ base: true, md: false })

  const [firstName, setFirstName] = useState("Christoph")
  const [lastName, setLastName] = useState("Winston")

  const [bulkNames, setBulkNames] = useState([])
  const [bulkStudents, addBulkStudents] = useBulkAddStudentsMutation()
  const [{ data, error, fetching }, addStudent] = useCreateStudentMutation()
  const handleFirstNameUpdate = (e) => {
    setFirstName(e.target.value)
  }

  const handleLastNameUpdate = (e) => {
    setLastName(e.target.value)
  }

  const handleFormSubmit = async () => {
    await addStudent({ firstName, lastName })
    if (error) {
      console.error("error", error)
      return
    }
    navigate("/students")
  }

  const handleBulkNameUpdate = (e) => {
    setBulkNames(e.target.value)
    console.log('bulk banes', bulkNames)
  }
  const handleBulkSubmission = (e) => {
    console.log('e', e.target.value)
    let names = bulkNames
    let data = []
    for (const name of names.split('\n')) {
      let firstName = name.split(' ').slice(0, -1).join(' ')
      let lastName = name.split(' ').slice(-1).join(' ')
      data.push({firstName, lastName})
    }
    addBulkStudents({data})

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
                  <Button variant="primary">Create</Button>
                </HStack>
              </Stack>

              <Stack spacing="5">
                <Box px={{ base: "4", md: "6" }} pt="5">
                  <Stack direction={{ base: "column", md: "row" }} justify="space-between">
                    <Text fontSize="lg" fontWeight="medium">
                      Add Student
                    </Text>
                  </Stack>
                </Box>
                <Box as="form" bg="bg-surface" boxShadow={useColorModeValue("sm", "sm-dark")} borderRadius="lg">
                  <Stack spacing="5" px={{ base: "4", md: "6" }} py={{ base: "5", md: "6" }}>
                    <Stack spacing="6" direction={{ base: "column", md: "row" }}>
                      <FormControl id="firstName">
                        <FormLabel>First Name</FormLabel>
                        <Input defaultValue={firstName} onChange={handleFirstNameUpdate} />
                      </FormControl>
                      <FormControl id="lastName" onChange={handleLastNameUpdate}>
                        <FormLabel>Last Name</FormLabel>
                        <Input defaultValue={lastName} />
                      </FormControl>
                    </Stack>
                  </Stack>
                  <Divider />
                  <Flex direction="row-reverse" py="4" px={{ base: "4", md: "6" }}>
                    <Button variant="primary" onClick={handleFormSubmit}>
                      Save
                    </Button>
                  </Flex>
                </Box>
              </Stack>

              <Stack spacing="5">
                <Box px={{ base: "4", md: "6" }} pt="5">
                  <Stack direction={{ base: "column" }} justify="space-between">
                    <Text fontSize="lg" fontWeight="medium">
                      Bulk Add Students
                    </Text>
                    <Text fontSize="sm" fontWeight="light">
                      Enter each student on a seperate line.
                    </Text>
                  </Stack>
                </Box>
                <Box as="form" bg="bg-surface" boxShadow={useColorModeValue("sm", "sm-dark")} borderRadius="lg">
                  <Stack spacing="5" px={{ base: "4", md: "6" }} py={{ base: "5", md: "6" }}>
                    <Stack spacing="6" direction={{ base: "column", md: "row" }}>
                      <FormControl id="firstName">
                        <FormLabel>Students</FormLabel>
                        <Textarea onChange={handleBulkNameUpdate} />
                      </FormControl>
                    </Stack>
                  </Stack>
                  <Divider />
                  <Flex direction="row-reverse" py="4" px={{ base: "4", md: "6" }}>
                    <Button variant="primary" onClick={handleBulkSubmission}>
                      Save
                    </Button>
                  </Flex>
                </Box>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Box>
    </Flex>
  )
}

export default AddStudent
