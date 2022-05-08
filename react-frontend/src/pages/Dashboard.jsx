
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  useBreakpointValue,
  Link
} from '@chakra-ui/react'
import {useState, useEffect} from 'react'
import { FiDownloadCloud } from 'react-icons/fi'
import { useRecoilState } from 'recoil'
import { loggedInUser, studentCount } from '../atom'
import { Card } from '../components/Card'
import { Navbar } from '../components/Navbar'
import { Sidebar } from '../components/Sidebar'
import { Stat } from '../components/Stat'
import { useStudentsCountQuery, useGetMyCoursesCountByTeacherQuery, useTotalCourseCountQuery } from '../generated/graphql'
import useDocumentTitle from '../utils/useDocumentTitle'
import {ImpersonateUserBanner} from '../components/ImpersonatedUserBanner'
const Dashboard = () => {
  useDocumentTitle('Hilger Portal - Dashboard')
  const isDesktop = useBreakpointValue({ base: false, lg: true })
  const [{data, error, fetching}, getStudentCount] = useStudentsCountQuery()
  const [students, setStudents] = useRecoilState(studentCount)
  const [user,setUser] = useRecoilState(loggedInUser)
  const [id, setId] = useState(null)
  const [courseCount,getCourseCount] = useGetMyCoursesCountByTeacherQuery({pause: !id, variables: {id}})

  const [totalCourses, getTotalCourses] = useTotalCourseCountQuery()
  useEffect(() => {
    if (students == 0 && !fetching) {
      setStudents(+data.studentsCount)

    }
  }, [fetching])

  useEffect(() => {
    if (!id && user){
      setId(user.id)
    }
  }, user)


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
          <ImpersonateUserBanner />

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
              </Stack>
              <Stack spacing={{ base: '5', lg: '6' }}>
                <SimpleGrid columns={{ base: 1, md: 3 }} gap="6">
                <Stat key="students" label="Students enrolled" value={students?.toString()} />
                <Stat key="myGrades" label="My Grades entered" value={(courseCount?.data) ? courseCount.data.coursesCount : "0"} />

                <Stat key="grades" label="Total grades entered" value={(totalCourses?.data) ? totalCourses.data.coursesCount : 0} />
                </SimpleGrid>
              </Stack>
              <Card minH="sm" display="flex" justifyContent="center" alignItems="center" flexDir="column">
              This section can be used for news and announcements
                <Divider w="50%" my={10}/>
                <HStack>

                <Button mr={10}><Link href='/students'>View All Students</Link></Button>
                  <Tooltip label="Only show students you have entered grades for">
                  <Button mr={10}><Link href={`/students/${(user) ? user.id : null}`}>View My Students</Link></Button>

                  </Tooltip>
                </HStack>
                </Card>
            </Stack>
          </Container>
        </Box>
      </Box>
    </Flex>
  )
}

export default Dashboard