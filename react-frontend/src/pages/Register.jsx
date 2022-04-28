import { 
  Box,
  Button,
  Flex,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  Alert,
  AlertTitle,
  AlertIcon,
  useBreakpointValue,
  useColorModeValue,
  AlertDescription, } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { InputField } from "../components/InputField"
import { UserContext } from "../UserContext"
import { PasswordField } from '../components/PasswordField'
import { toErrorMap } from "../utils/toErrorMap"
import {useLoginMutation, useRegisterMutation} from '../generated/graphql'
function Register() {
  const { state, setState } = useContext(UserContext)
  const [{data, error, fetching}, registerUser] = useRegisterMutation()
  const [loggedIn, doLogin] = useLoginMutation()
  let navigate = useNavigate()
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [name, setName] = useState(null)
  const [emailTaken, setEmailTaken] = useState(false)

  // const [cookies, setCookie, removeCookie] = useCookies(['keystonejs-session']);

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handleNameChange = (e) => {
    setName(e.target.value)
  }
  const handleRegister = async () => {
    await registerUser({email, password, name})

    if (error && error.message == "[GraphQL] Prisma error: Unique constraint failed on the fields: (`email`)") {
      setEmailTaken(true)
    }
    if (data.createUser){
      doLogin({email, password})
      navigate('/dashboard')
    }
  }
  return (
    <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
    <Stack spacing="8">
      <Stack spacing="6">
        <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
          <Heading size={useBreakpointValue({ base: 'xs', md: 'sm' })}>
            Create Account
          </Heading>

        </Stack>
      </Stack>
      <Box
        py={{ base: '0', sm: '8' }}
        px={{ base: '4', sm: '10' }}
        bg={useBreakpointValue({ base: 'transparent', sm: 'bg-surface' })}
        boxShadow={{ base: 'none', sm: useColorModeValue('md', 'md-dark') }}
        borderRadius={{ base: 'none', sm: 'xl' }}
      >
        <Stack spacing="6">
          <Stack spacing="5">
          <FormControl>
            


              <FormLabel htmlFor="name">Name</FormLabel>
              <Input id="name" type="name" onChange={handleNameChange} />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input id="email" type="email" onChange={handleEmailChange} />
            </FormControl>

            <PasswordField onChange={handlePasswordChange}/>
          </Stack>
          <Stack spacing="6">
          {(!emailTaken) ? null : (
            <Alert status='error'>
            <AlertIcon />
            <AlertTitle>Email adress already in use</AlertTitle>
          </Alert>
          )}
            <Button variant="primary" onClick={handleRegister}>Register</Button>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  </Container>
  )
}

export default Register
