import { Divider, Flex, Image, Stack, useColorModeValue } from "@chakra-ui/react"
import { FiHome, FiLogOut, FiUsers } from "react-icons/fi"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useCheckLoginQuery, useLogoutMutation } from "../generated/graphql"
import logo from "../logo.jpg"
import { NavButton } from "./NavButton"
import { UserProfile } from "./UserProfile"
import {loggedInUser as loggedInUserAtom} from '../atom'
import { useRecoilState } from "recoil"
export const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [, logOut] = useLogoutMutation()

  const [loggedInUser] = useRecoilState(loggedInUserAtom)

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
              {loggedInUser?.isParent ? null : (
                <Link to="/students">
                  <NavButton label="All Students" icon={FiUsers} aria-current={location.pathname === "/students" ? "page" : null} />
                </Link>
              )}
              {loggedInUser?.id ? (
                <Link to={`/students/${loggedInUser?.id}`}>
                  <NavButton label="My Students" icon={FiUsers} aria-current={location.pathname === "/students/" + loggedInUser?.id ? "page" : null} />
                </Link>
              ) : null}
              {!loggedInUser?.id || !loggedInUser?.isAdmin ? null : (
                <>
                  <Link to="/teachers">
                    <NavButton label="Teachers" icon={FiUsers} aria-current={location.pathname === "/teachers" ? "page" : null} />
                  </Link>

                  {/* <Link to="/parents">
              <NavButton label="Parents" icon={FiUsers} aria-current={location.pathname === "/parents" ? "page" : null} />
              </Link> */}
                </>
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
            {loggedInUser?.name ? <UserProfile name={loggedInUser?.name} image="https://tinyurl.com/yhkm2ek8" email={loggedInUser?.email} /> : null}
          </Stack>
        </Stack>
      </Flex>
    </Flex>
  )
}
