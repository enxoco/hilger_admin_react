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
const Layout = ({ children, customTitle, description }) => {
  let location = useLocation()

  const isDesktop = useBreakpointValue({ base: false, lg: true })
  const page = location.pathname.split("/")[1]
  const title = location.pathname === "/" ? "Dashboard" : page.split("")[0].toUpperCase() + page.split("").slice(1).join("")
  useDocumentTitle(`Hilger Portal - ${customTitle || title}`)
  const [user, setLoggedInUser] = useRecoilState(loggedInUser)
  const [me] = useCheckLoginQuery()

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
                    </Heading>
                    <Text color="muted">{description}</Text>
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
