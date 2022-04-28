import { Icon } from "@chakra-ui/icons"
import { Box, Button, Divider, Flex, HStack, Image, Input, InputGroup, InputLeftElement, Progress, Stack, Text, useColorModeValue } from "@chakra-ui/react"
import { FiHelpCircle, FiHome, FiLogOut, FiSearch, FiSettings, FiUsers } from "react-icons/fi"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useRecoilState } from "recoil"
import { loggedInUser } from "../atom"
import { useLogoutMutation } from "../generated/graphql"
import { NavButton } from "./NavButton"
import { UserProfile } from "./UserProfile"

export const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [user] = useRecoilState(loggedInUser)
  const [, logOut] = useLogoutMutation()

  async function handleLogout(e) {
    e.preventDefault()
    const _ = await logOut()
    navigate("/login")
  }
  return (
    <Flex as="section" minH="100vh" bg="bg-canvas">
      <Flex flex="1" bg="bg-surface" overflowY="auto" boxShadow={useColorModeValue("md", "sm-dark")} maxW={{ base: "full", sm: "xs" }} py={{ base: "6", sm: "8" }} px={{ base: "4", sm: "6" }}>
        <Stack justify="space-between" spacing="1">
          <Stack spacing={{ base: "5", sm: "6" }} shouldWrapChildren>
            <Image mx="auto" src="https://hhlearning.com/wp-content/uploads/2017/04/cropped-HH-Logo.png" maxH="200px" />
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color="muted" boxSize="5" />
              </InputLeftElement>
              <Input placeholder="Search" />
            </InputGroup>
            <Stack spacing="1">
              <Link to="/dashboard">
                <NavButton label="Dashboard" icon={FiHome} aria-current={location.pathname.includes("dashboard") ? "page" : null} />
              </Link>
              <Link to="/students">
                <NavButton label="All Students" icon={FiUsers} aria-current={location.pathname === "/students" ? "page" : null} />
              </Link>
              {user ? (
                <Link to={`/students/${user.id}`}>
                  <NavButton label="My Students" icon={FiUsers} aria-current={location.pathname === "/students/" + user.id ? "page" : null} />
                </Link>
              ) : null}
              {!user || !user.isAdmin ? null : (
                <Link to="/teachers">
                  <NavButton label="Teachers" icon={FiUsers} />
                </Link>
              )}
            </Stack>
          </Stack>
          <Stack spacing={{ base: "5", sm: "6" }}>
            <Stack spacing="1">
              <NavButton label="Help" icon={FiHelpCircle} />
              <NavButton label="Settings" icon={FiSettings} />
              <NavButton label="Logout" icon={FiLogOut} onClick={handleLogout} />
            </Stack>
            <Box bg="bg-subtle" px="4" py="5" borderRadius="lg">
              <Stack spacing="4">
                <Stack spacing="1">
                  <Text fontSize="sm" fontWeight="medium">
                    Almost there
                  </Text>
                  <Text fontSize="sm" color="muted">
                    Fill in some more information about you and your person.
                  </Text>
                </Stack>
                <Progress value={80} size="sm" aria-label="Profile Update Progress" />
                <HStack spacing="3">
                  <Button variant="link" size="sm">
                    Dismiss
                  </Button>
                  <Button variant="link" size="sm" colorScheme="blue">
                    Update profile
                  </Button>
                </HStack>
              </Stack>
            </Box>
            <Divider />
            {user ? <UserProfile name={user.name} image="https://tinyurl.com/yhkm2ek8" email={user.email} /> : null}
          </Stack>
        </Stack>
      </Flex>
    </Flex>
  )
}
