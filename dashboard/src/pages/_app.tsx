import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react'
import theme from '../theme'
import {createContext, useContext, useState} from 'react'
import GlobalContext from 'src/utils/globalContext'

const AdminContext = createContext(undefined)

function MyApp({ Component, pageProps }: any) {
  
  const [state, setState] = useState({
    count: 0,
    myStudents: null,
    teacherId: 0,
    teacher: {
      id: null
    },
    update
  })

  function update(data) {
    setState(Object.assign({}, state, data));
  }
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider
        options={{
          useSystemColorMode: true,
        }}
      >
      <GlobalContext.Provider value={state}>
        <Component {...pageProps} />
      </GlobalContext.Provider>
      </ColorModeProvider>
    </ChakraProvider>

  )
}

export default MyApp
