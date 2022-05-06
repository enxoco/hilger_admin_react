import React, { useEffect } from "react"
import ReactDOM from "react-dom"

import './index.css'
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import { createClient, Provider } from "urql"
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { theme } from "@chakra-ui/pro-theme"
// import '@fontsource/inter/variable.css'
import { RecoilRoot, atom, useRecoilState } from "recoil"
import { Routes, Route, Link, useNavigate, useLocation, Navigate, Outlet, Router, BrowserRouter } from "react-router-dom"
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

import { loggedInUser } from "./atom"
import { useCheckLoginQuery } from "./generated/graphql"
import StudentReport from "./pages/StudentReport"

const client = createClient({
  url: "/api/graphql",
})

const myTheme = extendTheme(
  {
    colors: { ...theme.colors, brand: theme.colors.blue },
  },
  theme
)


function RequireAuth({ children }: { children: JSX.Element }) {
  const [user, setUser] = useRecoilState(loggedInUser)
  const [me, executeMeQuery] = useCheckLoginQuery({pause: user})
  let location = useLocation()

  if (!user && !me.fetching) {
    if (!user && !me.data.authenticatedItem) {
      
      return <Navigate to="/login" state={{ from: location }} replace />

    }
  }

  return children
}

ReactDOM.render(
  <React.StrictMode>
    <Provider value={client}>
      <ChakraProvider theme={myTheme}>
        <UserProvider>
          <RecoilRoot>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={
                    <RequireAuth>
                      <Dashboard />
                    </RequireAuth>
                  }
                />
                <Route path="/students" element={
                  <RequireAuth>
                    <Students />
                  </RequireAuth>
                } />
                <Route path="/students/:id" element={<RequireAuth>
                  <MyStudents />
                </RequireAuth>} />

                <Route path="/student/:id" element={
                  <RequireAuth>
                    <EditStudent />
                  </RequireAuth>
                } />
                                <Route path="/student/:id/print" element={
                  <RequireAuth>
                    <StudentReport />
                  </RequireAuth>
                } />
                <Route path="/teachers" element={
                  <RequireAuth>
                    <Teachers />
                  </RequireAuth>
                } />
                <Route path="/add-teacher" element={<RequireAuth><AddTeacher /></RequireAuth>} />

                <Route path="/add-student" element={<RequireAuth><AddStudent /></RequireAuth>} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
                {/* <Route path="/add" element={<AddLocation />} />
              <Route path="/location/:id" element={<Location />} /> */}
              </Routes>
            </BrowserRouter>
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
