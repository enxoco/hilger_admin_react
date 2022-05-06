import { Box, Button, CloseButton, Container, Link, Stack, Text } from "@chakra-ui/react"
import * as React from "react"
import { useRecoilState } from "recoil"
import {impersonateUser as impersonateUserAtom} from '../atom'
export const ImpersonateUserBanner = (props: any) => {

  const [impersonatedUser, setImpersonatedUser] = useRecoilState(impersonateUserAtom)
  const unimpersonate = () => {
    
  }
  return (
    !impersonatedUser ? null : (
      <Box as="section" pb={{ base: "12", md: "24" }}>
        <Box bg="bg-accent" color="on-accent" position="relative">
          <Container py={{ base: "4", md: "3.5" }}>
            <Stack direction={{ base: "column", md: "row" }} justify="center" spacing={{ base: "0.5", md: "1.5" }} pe={{ base: "4", sm: "0" }}>
              <Text fontWeight="medium">You are currently viewing the portal as {impersonatedUser.name}</Text>
              <Text color="on-accent-muted">To go back to your account <Link variant="ghost" onClick={() => window.location.reload()}>Click Here</Link></Text>
            </Stack>
            <CloseButton position="absolute" right="2" top="2.5" />
          </Container>
        </Box>
      </Box>
    )
  )
}