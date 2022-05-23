import { HStack, IconButton, Skeleton, Stack, Switch, Text, Tooltip } from "@chakra-ui/react"
import { useMemo } from "react"
import { FiEdit2, FiLogIn } from "react-icons/fi"
import { useRecoilState } from "recoil"
import { impersonateUser as impersonateUserAtom, loggedInUser } from "../atom"
import Layout from "../components/Layout"
import ParentTable from "../components/ParentTable"
import { useGetAllParentsQuery, useTogglePaidTuitionMutation } from "../generated/graphql"

const Parents = () => {
  const [studentData] = useGetAllParentsQuery()
  const [, setTuitionStatus] = useTogglePaidTuitionMutation()
  const [, setImpersonatedUser] = useRecoilState(impersonateUserAtom)
  const [, setUser] = useRecoilState(loggedInUser)

  const toggleTuitionStatus = (e, parent) => {
    e.preventDefault()
    setTuitionStatus({
      id: parent.id,
      hasPaid: !parent.hasPaidTuition,
    })
  }
  async function impersonate(member) {
    await setImpersonatedUser(member)
    setUser(member)
  }

  const columns = useMemo(
    () => [
      {
        Header: () => null,
        accessor: "id",
      },
      {
        Header: () => "First Name",
        accessor: "name",
      },
      {
        Header: () => "Last name",
        accessor: "lastName",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Students",
        accessor: "student",
        Cell: ({ row }) => (
          <Text>
            {row.values.student.map((student, index) => (
              <>
                {student.firstName}
                {index == row.values.student.length - 1 ? null : ", "}
              </>
            ))}
          </Text>
        ),
      },
      {
        Header: "Has Paid Tuition",
        accessor: "hasPaidTuition",
        canFilter: false,
        filter: false,
        Cell: ({ row }) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <>
            <Switch defaultChecked={row.values.hasPaidTuition} onChange={(e) => toggleTuitionStatus(e, row.values)} />
          </>
        ),
      },
      {
        Header: () => null,
        id: "actions",
        filter: null,
        isSorted: true,
        Cell: ({ row }) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <>
            <HStack spacing="1">
              <Tooltip label="Manage courses">
                <IconButton icon={<FiEdit2 fontSize="1.25rem" />} variant="ghost" aria-label="Edit Course" />
              </Tooltip>
              <Tooltip label="Impersonate Parent">
                <IconButton icon={<FiLogIn />} onClick={() => impersonate(row.values)}></IconButton>
              </Tooltip>
            </HStack>
          </>
        ),
      },
    ],
    []
  )

  return (
    <Layout customTitle="All Parents" description="" adminOnly={true}>
      <Stack spacing="5">
        <Skeleton isLoaded={studentData?.data}>
          <ParentTable columns={columns} data={studentData?.data?.users || []} />
        </Skeleton>
      </Stack>
    </Layout>
  )
}

export default Parents
