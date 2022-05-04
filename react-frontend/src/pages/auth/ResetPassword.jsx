import { Box, Button, Flex, Checkbox, Container, Divider, FormControl, FormLabel, Heading, HStack, Input, Stack, Text, useBreakpointValue, useColorModeValue, Alert, AlertTitle, AlertIcon } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import { useContext, useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { InputField } from "../../components/InputField"
import { UserContext } from "../../UserContext"
import { PasswordField } from "../../components/PasswordField"
import Hashids from "hashids"
import { useForgotPasswordMutation, useGetUserEmailByIdQuery, useRedeemPasswordResetTokenMutation } from "../../generated/graphql"
function ResetPassword() {
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
    e.preventDefault()
    if (email && email.data?.user?.email) {
      const newPassword = await updatePassword({ email: email && email.data?.user?.email, token, password })
      console.log("new password", newPassword)
      if (newPassword.data && newPassword.data.redeemUserPasswordResetToken) {
        if (newPassword.data.redeemUserPasswordResetToken.code === "TOKEN_REDEEMED") {
          setStatus("Please try to login")
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
              <Alert status="success">
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
