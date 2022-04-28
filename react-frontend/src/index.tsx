import React from "react"
import ReactDOM from "react-dom"

import App from "./App"
import reportWebVitals from "./reportWebVitals"
import { createClient, Provider } from "urql"
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { theme } from "@chakra-ui/pro-theme"
// import '@fontsource/inter/variable.css'
import { RecoilRoot, atom, useRecoilState } from "recoil"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { UserProvider } from "./UserContext"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Students from "./pages/Students"
import AddStudent from "./pages/AddStudent"
import EditStudent from "./pages/EditStudent"
import Teachers from "./pages/Teachers"
import MyStudents from "./pages/MyStudents"
import AddTeacher from "./pages/AddTeacher"
import ForgotPassword from "./pages/auth/ForgotPassword"
import ResetPassword from "./pages/auth/ResetPassword"
const client = createClient({
  url: "/api/graphql",
})
const myTheme = extendTheme(
  {
    colors: { ...theme.colors, brand: theme.colors.blue },
  },
  theme
)

ReactDOM.render(
  <React.StrictMode>
    <Provider value={client}>
      <ChakraProvider theme={myTheme}>
        <UserProvider>
          <RecoilRoot>
            <Router basename="/">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/students" element={<Students />} />
                <Route path="/students/:id" element={<MyStudents />} />

                <Route path="/student/:id" element={<EditStudent />} />
                <Route path="/teachers" element={<Teachers />} />
                <Route path="/add-teacher" element={<AddTeacher />} />

                <Route path="/add-student" element={<AddStudent />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:id/:token" element={<ResetPassword />}/>
                {/* <Route path="/add" element={<AddLocation />} />
              <Route path="/location/:id" element={<Location />} /> */}
              </Routes>
            </Router>
          </RecoilRoot>
        </UserProvider>
      </ChakraProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
