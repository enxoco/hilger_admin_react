import { Alert, AlertIcon, AlertTitle, Box, Button, Container, Heading, HStack, Stack, Text, useBreakpointValue, useColorModeValue } from "@chakra-ui/react"
import Hashids from "hashids"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { PasswordField } from "../../components/PasswordField"
import { useForgotPasswordMutation, useGetUserEmailByIdQuery, useRedeemPasswordResetTokenMutation } from "../../generated/graphql"
import useDocumentTitle from "../../utils/useDocumentTitle"
function ResetPassword() {
  useDocumentTitle('Hilger Portal - Reset password')
  const hashids = new Hashids("this is my salt", 8, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890")

  const { id, token } = useParams()
  const navigate = useNavigate()
  console.log("id", hashids.decode(id))
  const [_, doPasswordReset] = useForgotPasswordMutation()
  const [password, setPassword] = useState(null)
  const [status, setStatus] = useState(null)
  const [email, getEmail] = useGetUserEmailByIdQuery({ pause: !id, variables: { id: hashids.decode(id)[0] } })
  const [updatedPassword, updatePassword] = useRedeemPasswordResetTokenMutation()
  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  async function handleRequest(e) {
    console.log('e', email.data)
    e.preventDefault()
    if (email && email.data?.user?.email) {
      const newPassword = await updatePassword({ email: email && email.data?.user?.email, token, password })
      if (newPassword.data && newPassword.data.redeemUserPasswordResetToken) {
        if (newPassword.data.redeemUserPasswordResetToken.code === "TOKEN_REDEEMED") {
          setStatus("Please try to login")
        }
        if (newPassword.data.redeemUserPasswordResetToken.code === "FAILURE") {
          setStatus("The link you have followed is expired.  Please try requesting another password reset.")
        }
      } else {
        navigate("/login")
      }
    }
  }

  return (
    <Container maxW="lg" py={{ base: "12", md: "24" }} px={{ base: "0", sm: "8" }}>
      <Stack spacing="8">
        <Stack spacing="6">
          <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
            <Heading size={useBreakpointValue({ base: "xs", md: "sm" })}>Request new password</Heading>
            <HStack spacing="1" justify="center">
              <Text color="muted">Please enter your new password</Text>
            </HStack>

            {status ? (
              <Alert status={(status && status.includes('login')) ? "success" : "error"}>
                <AlertIcon />
                <AlertTitle>{status}</AlertTitle>
              </Alert>
            ) : null}
          </Stack>
        </Stack>
        <Box py={{ base: "0", sm: "8" }} px={{ base: "4", sm: "10" }} bg={useBreakpointValue({ base: "transparent", sm: "bg-surface" })} boxShadow={{ base: "none", sm: useColorModeValue("md", "md-dark") }} borderRadius={{ base: "none", sm: "xl" }}>
          <form onSubmit={handleRequest}>
            <Stack spacing="6">
              <Stack spacing="5">
                <PasswordField onChange={handlePasswordChange} />
              </Stack>
              <Stack spacing="6">
                <Button variant="primary" onClick={handleRequest} isLoading={updatedPassword.fetching}>
                  Request password reset
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  )
}

export default ResetPassword
