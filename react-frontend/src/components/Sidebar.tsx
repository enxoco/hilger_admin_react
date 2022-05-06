import { Icon } from "@chakra-ui/icons"
import { Box, Button, Divider, Flex, HStack, Image, Input, InputGroup, InputLeftElement, Progress, Stack, Text, useColorModeValue } from "@chakra-ui/react"
import { useEffect } from "react"
import { FiHelpCircle, FiHome, FiLogOut, FiSearch, FiSettings, FiUsers } from "react-icons/fi"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useRecoilState } from "recoil"
import { loggedInUser } from "../atom"
import { useCheckLoginQuery, useLogoutMutation } from "../generated/graphql"
import { NavButton } from "./NavButton"
import { UserProfile } from "./UserProfile"
import logo from '../logo.jpg'
export const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useRecoilState(loggedInUser)
  const [, logOut] = useLogoutMutation()

  const [me, executeMeQuery] = useCheckLoginQuery()
  useEffect(() => {
      if (user === null && !me.fetching && me.data.authenticatedItem){
          setUser(me.data.authenticatedItem)
      } 

  }, [me.fetching])
  async function handleLogout(e) {
    e.preventDefault()
    const _ = await logOut()
    navigate("/login")
  }


  return (
    <Flex as="section" minH="100vh" bg="bg-canvas" w={300}>
      <Flex flex="1" bg="bg-surface" overflowY="auto" boxShadow={useColorModeValue("md", "sm-dark")} maxW={{ base: "full", sm: "xs" }} py={{ base: "6", sm: "8" }} px={{ base: "4", sm: "6" }}>
        <Stack justify="space-between" spacing="1">
          <Stack spacing={{ base: "5", sm: "6" }} shouldWrapChildren>
            <Image mx="auto" src={logo} h={217} w={225} />

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
              {/* <NavButton label="Help" icon={FiHelpCircle} />
              <NavButton label="Settings" icon={FiSettings} /> */}
              <NavButton label="Logout" icon={FiLogOut} onClick={handleLogout} />
            </Stack>

            <Divider />
            {user ? <UserProfile name={user.name} image="https://tinyurl.com/yhkm2ek8" email={user.email} /> : null}
          </Stack>
        </Stack>
      </Flex>
    </Flex>
  )
}
