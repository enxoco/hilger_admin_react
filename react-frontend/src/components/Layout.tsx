import { Box, Container, Flex, Heading, Spinner, Stack, Text, useBreakpointValue } from "@chakra-ui/react"
import { useEffect } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useRecoilState } from "recoil"
import { loggedInUser } from "../atom"
import { ImpersonateUserBanner } from "../components/ImpersonatedUserBanner"
import { Navbar } from "../components/Navbar"
import { Sidebar } from "../components/Sidebar"
import { useCheckLoginQuery } from "../generated/graphql"
import useDocumentTitle from "../utils/useDocumentTitle"
import {useLocalStorage} from '../hooks/useLocalStorage'
const Layout = ({ children, customTitle, description }) => {
  let location = useLocation()

  const isDesktop = useBreakpointValue({ base: false, lg: true })
  const splitPath = location.pathname.split('/')
  let title
  console.log('splitPath', splitPath[1] == '')
  if (splitPath[1] && splitPath[1] == ''){//Dealing with homepage
    title = ''
  } else {
    console.log('what is going on', splitPath)
    title = location.pathname === "/" ? "Dashboard" : splitPath[1].split("")[0].toUpperCase() + splitPath[1].split("").slice(1).join("")

  }
  // const page = location.pathname.split("/")[1]
  // const title = location.pathname === "/" ? "Dashboard" : page.split("")[0].toUpperCase() + page.split("").slice(1).join("")
  useDocumentTitle(`Hilger Portal ${customTitle || title}`)
  const [user, setLoggedInUser] = useRecoilState(loggedInUser)
  const [localUser, setLocalUser] = useLocalStorage("user", "")
  const [me, checkLogin] = useCheckLoginQuery()

  function RequireAuth({ children }: { children: JSX.Element }) {
    if (!user && !me.fetching && !me?.data?.authenticatedItem) {
      return <Navigate to="/login" state={{ from: location }} replace />
    }
    /**
     * If we don't have a user
     * and the me query hasn't
     * yet completed, then we should
     * return an empty element,
     * otherwise return our layout
     */
    return (!user && !me.data?.authenticatedItem) ? (<></>) : children
  }



  /**
   * 
   * The goal is to make sure that we always
   * have user information stored in localstorage
   * so if a user has logged in but does not have
   * anything stored, we need to set it.
   * 
   * This will also ensure that loggedInUser
   * always has a value.  
   * 
   * We will need to come back and clean this up
   * to deal with impersonated users.
   */
  useEffect(() => {
    async function checkLocalStorage() {

      if (!localUser.id && me?.data?.authenticatedItem){
        setLocalUser(me?.data?.authenticatedItem)
        setLoggedInUser(me?.data?.authenticatedItem)

      }

      setLoggedInUser(me?.data?.authenticatedItem)
    }
    checkLocalStorage()

  },[me.fetching])

  // useEffect()

  return (
    <RequireAuth>
      <Flex as="section" direction={{ base: "column", lg: "row" }} height="100vh" bg="bg-canvas" overflowY="auto">
        {isDesktop ? <Sidebar /> : <Navbar />}

        <Box bg="bg-surface" pt={{ base: "0", lg: "3" }} flex="1">
          <Box bg="bg-canvas" borderTopLeftRadius={{ base: "none", lg: "2rem" }} height="full">
            <Container py="8">
              <ImpersonateUserBanner />
              <Stack spacing={{ base: "8", lg: "6" }}>
                <Stack spacing="4" direction={{ base: "column", lg: "row" }} justify="space-between" align={{ base: "start", lg: "center" }}>
                  <Stack spacing="1">
                    <Heading size={useBreakpointValue({ base: "xs", lg: "sm" })} fontWeight="medium">
                      {customTitle || title}
                      {JSON.stringify(localUser)}

                    </Heading>
                    <Text color="muted">{description} </Text>
                  </Stack>
                </Stack>
                {children}
              </Stack>
            </Container>
          </Box>
        </Box>
      </Flex>

    </RequireAuth>

    
  )
}

export default Layout
