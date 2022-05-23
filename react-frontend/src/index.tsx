import { theme } from "@chakra-ui/pro-theme"
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Route, Routes } from "react-router-dom"
// import '@fontsource/inter/variable.css'
import { RecoilRoot } from "recoil"
import { createClient, Provider } from "urql"
import "./index.css"
import AddStudent from "./pages/AddStudent"
import AddTeacher from "./pages/AddTeacher"
import ForgotPassword from "./pages/auth/ForgotPassword"
import ResetPassword from "./pages/auth/ResetPassword"
import Dashboard from "./pages/Dashboard"
import EditStudent from "./pages/EditStudent"
import Login from "./pages/Login"
import MyStudents from "./pages/MyStudents"
import Parents from "./pages/Parents"
import Register from "./pages/Register"
import StudentReport from "./pages/StudentReport"
import Students from "./pages/Students"
import Teachers from "./pages/Teachers"
import reportWebVitals from "./reportWebVitals"

// import Parents from "./pages/Parents"
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
          <RecoilRoot>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/students" element={<Students />} />
                <Route path="/students/:id" element={<MyStudents />} />
                <Route path="/student/:id" element={<EditStudent />} />
                <Route path="/student/:id/report" element={<StudentReport />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:id/:token" element={<ResetPassword />} />

                {/**
                 * 
                 * Only users with admin access should be able to access
                 * these routes
                 */}
                <Route path="/add-student" element={<AddStudent />} />
                <Route path="/teachers" element={<Teachers />} />
                <Route path="/parents" element={<Parents />} />
                <Route path="/add-teacher" element={<AddTeacher />} />

              </Routes>
            </BrowserRouter>
          </RecoilRoot>
      </ChakraProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
