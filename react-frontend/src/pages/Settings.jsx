import { Box, Button, ButtonGroup, FormControl, FormLabel, HStack, Icon, Input, InputGroup, InputLeftElement, Stack, Text, useBreakpointValue } from "@chakra-ui/react"

import { FiDownloadCloud, FiSearch } from "react-icons/fi"
import {useState, useEffect} from 'react'
import { Link } from "react-router-dom"
import Layout from "../components/Layout"
import { useFetchSettingsQuery } from "../generated/graphql"
import useDocumentTitle from "../utils/useDocumentTitle"
const Settings = () => {
  useDocumentTitle("Hilger Portal - Settings")

  const isMobile = useBreakpointValue({ base: true, md: false })
  const [settings, fetchSettings] = useFetchSettingsQuery()
  const [semester, updateSemester] = useState(null)
  const handleSemesterUpdate = () => {
    updateSemester(e.target.value)
  }

  useEffect(() => {

    if (!semester && settings.data?.settings) {
      updateSemester(settings.data?.settings.filter(a => a.name == 'Semester')[0].value)
    }
  }, [settings.data])
  
  return (
    <Layout adminOnly={false}>
      <Stack spacing="5">
        <Box px={{ base: "4", md: "6" }} pt="5">
          <Stack direction={{ base: "column", md: "row" }} justify="space-between">
            <Text fontSize="lg" fontWeight="medium">
              Settings
            </Text>
          </Stack>
        </Box>
        <Box overflowX="auto">
          <FormControl>
            <FormLabel>Semester</FormLabel>
            <Input defaultValue={semester} />
          </FormControl>
        </Box>
      </Stack>
    </Layout>
  )
}

export default Settings
