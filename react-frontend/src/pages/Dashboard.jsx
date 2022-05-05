
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react'
import * as React from 'react'
import { useContext } from 'react'
import { FiDownloadCloud } from 'react-icons/fi'
import { Card } from '../components/Card'
import { Navbar } from '../components/Navbar'
import { Sidebar } from '../components/Sidebar'
import {Stat} from '../components/Stat'
import { useStudentsCountQuery } from '../generated/graphql'
import {useRecoilState, useRecoilValue} from 'recoil'

import { studentCount, loggedInUser } from '../atom'
import useDocumentTitle from '../utils/useDocumentTitle'
const Dashboard = () => {
  useDocumentTitle('Hilger Portal - Dashboard')
  const isDesktop = useBreakpointValue({ base: false, lg: true })
  const [{data, error, fetching}, getStudentCount] = useStudentsCountQuery()
  const [students, setStudents] = useRecoilState(studentCount)
  const [user,setUser] = useRecoilState(loggedInUser)
  React.useEffect(() => {
    if (students == 0 && !fetching) {
      setStudents(+data.studentsCount)
    }
  }, [fetching])
  return (
    <Flex
      as="section"
      direction={{ base: 'column', lg: 'row' }}
      height="100vh"
      bg="bg-canvas"
      overflowY="auto"
    >
      {isDesktop ? <Sidebar /> : <Navbar />}
      <Box bg="bg-surface" pt={{ base: '0', lg: '3' }} flex="1">
        <Box bg="bg-canvas" borderTopLeftRadius={{ base: 'none', lg: '2rem' }} height="full">
          <Container py="8">
            <Stack spacing={{ base: '8', lg: '6' }}>
              <Stack
                spacing="4"
                direction={{ base: 'column', lg: 'row' }}
                justify="space-between"
                align={{ base: 'start', lg: 'center' }}
              >
                <Stack spacing="1">
                  <Heading size={useBreakpointValue({ base: 'xs', lg: 'sm' })} fontWeight="medium">
                    Dashboard
                  </Heading>
                  <Text color="muted">All important metrics at a glance</Text>
                </Stack>
                <HStack spacing="3">
                  <Button variant="secondary" leftIcon={<FiDownloadCloud fontSize="1.25rem" />}>
                    Download
                  </Button>
                  <Button variant="primary">Create</Button>
                </HStack>
              </Stack>
              <Stack spacing={{ base: '5', lg: '6' }}>
                <SimpleGrid columns={{ base: 1, md: 3 }} gap="6">
                <Stat key="students" label="Students enrolled" value={students.toString()} />
                <Stat key="myGrades" label="My Grades entered" value="?" />

                <Stat key="grades" label="Total grades entered" value="0" />
                </SimpleGrid>
              </Stack>
              <Card minH="sm" />
            </Stack>
          </Container>
        </Box>
      </Box>
    </Flex>
  )
}

export default Dashboard