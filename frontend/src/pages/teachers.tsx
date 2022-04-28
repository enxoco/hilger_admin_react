import { EmailIcon } from "@chakra-ui/icons"
import { Heading } from "@chakra-ui/layout"
import { FormLabel, IconButton, Switch, Table, Tbody, Td, Thead, Tr } from "@chakra-ui/react"
import { withUrqlClient } from "next-urql"
import React, { useContext, useReducer, useState } from "react"
import { Card } from "src/components/elements/Card"
import GlobalContext from "src/utils/globalContext"
import { Layout } from "../components/Layout"
import { useTeachersQuery, useToggleAdminMutation } from "../generated/graphql"
import { createUrqlClient } from "../utils/createUrqlClient"


const TeachersIndex = () => {
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  const [{data, fetching}, setTeachers] = useTeachersQuery()

  const [teacherList, setTeacherList] = useState([])
  const [, toggleAdmin] = useToggleAdminMutation()

  const [fetched, setFetched] = useState(false)
  
  const global = useContext(GlobalContext)

  if (!fetching && !data) {
    return <div>you got no students for some reason</div>
  }

  // if (!fetching && data && !teachers) {
  //   setTeachers(data.teachers)
  // }
  async function handleToggle(status: boolean, id: any){
    const updated = await toggleAdmin({adminStatus: status, teacherId: id})

    await setTeachers()

    forceUpdate()
    return updated
    // if (updated.data?.toggleAdmin) {
    //   checkbox.setAttribute('data-checked', '')
    // } else {
    //   checkbox.removeAttribute('data-checked')
    // }

    // e.target.isChecked = updated.data?.toggleAdmin

    // setTeachers()
  }


  return (
    <Layout>
      <Card textAlign="center">
        <Heading>Teachers</Heading>

          <Table>
            <Thead>
              <Tr>
                <Td>Name</Td>
                <Td>Email</Td>
                <Td>Admin</Td>
                <Td>Reset Password</Td>
              </Tr>
            </Thead>
            <Tbody>
            {data?.teachers.map((teacher, index) => (
              <Tr key={index}>
                <Td>
                  {teacher.firstName} {teacher.lastName}
                </Td>
                <Td>{teacher.email}</Td>
                <Td>

                  <Switch value={teacher.isAdmin} isChecked={teacher.isAdmin} onChange={async () => await handleToggle(!teacher.isAdmin, teacher.id)} />
                </Td>
                <Td>
                <IconButton icon={<EmailIcon />} ></IconButton>

                </Td>


              </Tr>
            ))}
            </Tbody>

          </Table>
        </Card>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: false })(TeachersIndex)
