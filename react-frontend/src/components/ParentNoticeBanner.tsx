import { Box, Button, CloseButton, Container, Link, Stack, Text } from "@chakra-ui/react"
import * as React from "react"
import { useRecoilState } from "recoil"
import {impersonateUser as impersonateUserAtom, loggedInUser as loggedInUserAtom} from '../atom'
export const ParentNoticeBanner = (props: any) => {

  const [loggedInUser] = useRecoilState(loggedInUserAtom)

  return (
    !loggedInUser?.isParent ? null : (
      loggedInUser.hasPaidTuition ? null : (
        <Box bg="bg-accent" color="on-accent" position="relative" w="100%">
          <Container py={{ base: "4", md: "3.5" }}>
            <Stack direction={{ base: "column", md: "row" }} justify="center" spacing={{ base: "0.5", md: "1.5" }} pe={{ base: "4", sm: "0" }}>
              <Text fontWeight="medium">It looks like you have an unpaid balance.  In order to view your students report cards you will need to ensure that tuition has been paid in full.</Text>
            </Stack>
          </Container>
        </Box>
      )

    )
  )
  
}