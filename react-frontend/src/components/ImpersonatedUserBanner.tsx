import { Box, Button, CloseButton, Container, Link, Stack, Text } from "@chakra-ui/react"
import * as React from "react"
import { useRecoilState } from "recoil"
import {impersonateUser as impersonateUserAtom, loggedInUser} from '../atom'
import { useLocalStorage } from "../hooks/useLocalStorage"
export const ImpersonateUserBanner = (props: any) => {

  const [isImpersonating, setIsImpersonating] = useRecoilState(impersonateUserAtom)
  const [user, setUser] = useRecoilState(loggedInUser)
  const [localUser, setLocalUser] = useLocalStorage("user", "")

  const unimpersonate = () => {
    setIsImpersonating(false)
    setUser({})
    delete user.impersonating
    console.log(user.impersonating)
    // setUser(user)
    setUser({...user})
    setLocalUser(user)
  }

  console.log('user', user)

  React.useEffect(() => {
    console.log('user has changed')
  },[user])
  return (
    !user?.impersonating?.id ? null : (
      <Box as="section" pb={{ base: "12", md: "24" }}>
        <Box bg="bg-accent" color="on-accent" position="relative">
          <Container py={{ base: "4", md: "3.5" }}>
            <Stack direction={{ base: "column", md: "row" }} justify="center" spacing={{ base: "0.5", md: "1.5" }} pe={{ base: "4", sm: "0" }}>
              <Text fontWeight="medium">You are currently viewing the portal as {user?.impersonating?.name || user?.impersonating?.email}</Text>
              <Text color="on-accent-muted">To go back to your account <Link variant="ghost" onClick={unimpersonate}>Click Here</Link></Text>
            </Stack>
            <CloseButton position="absolute" right="2" top="2.5" onClick={unimpersonate} />
          </Container>
        </Box>
      </Box>
    )
  )
}