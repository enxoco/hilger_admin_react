// import React from 'react';
// import {} from '@chakra-ui/icons'
// import {Box, Flex, Heading, Grid, Button, Text, Badge} from '@chakra-ui/react'
// import { useState, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import {UserContext} from './UserContext'
// import { useIsAuth } from './utils/useIsAuth'
// import {LogoutMutation, useLogoutMutation} from './generated/graphql'

// function App() {

//   useIsAuth()
//   let navigate = useNavigate()

//   const {state} = useContext(UserContext)
//   const [logout, doLogout] = useLogoutMutation()
//   const handleLogout = async () => {
//     await doLogout()
//     navigate('/dashboard')
//   }
//   return (
//     <Box>
//       <Flex justifyContent={"space-between"} p={5}>
//         <Box>Hilger Admin</Box>
//         <Box>
//         {(!state.teacher) ? (
//           <Button><Link to="/login">Login</Link></Button>
//         ) : (
//           <>
//           <Badge>Hello, {state.teacher.name || state.teacher.email}</Badge>
//           <Button onClick={handleLogout}>Logout</Button>
//           </>

//         )}
//         </Box>
//       </Flex>
//     </Box>
//   );
// }

// export default App;
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
} from '@chakra-ui/react'
import * as React from 'react'
import { useContext } from 'react'
import { FiDownloadCloud } from 'react-icons/fi'
import { Card } from './components/Card'
import { Navbar } from './components/Navbar'
import { Sidebar } from './components/Sidebar'
import { useIsAuth } from './utils/useIsAuth'

const App = () => {

  useIsAuth()
  const isDesktop = useBreakpointValue({ base: false, lg: true })
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
                  <Card />
                  <Card />
                  <Card />
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

export default App