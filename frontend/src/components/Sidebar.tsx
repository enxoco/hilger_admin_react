import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Heading } from "@chakra-ui/react"
import NextLink from "next/link"
import { useRouter } from "next/router"
import React, { useContext, useEffect, useState } from "react"
import GlobalContext from "src/utils/globalContext"
import { Text } from "@chakra-ui/react"
import {useLocalStorage} from '../utils/useLocalStorage'
interface SidebarProps {}

export const Sidebar: React.FC<SidebarProps> = ({}) => {
  const router = useRouter()
  const global = useContext(GlobalContext)

  const [myStudentsAccordionState, setMyStudentsAccordionState] = useLocalStorage("myStudentsAccordionState", 0);
  function handleClick(){
    if (myStudentsAccordionState == "1"){
      setMyStudentsAccordionState("0")
    } else {
      setMyStudentsAccordionState("1")
    }
  }

  return (
    <Box bg="#0071a1" color="white" mr={40} p={10} height="100vh">
      
      <Text fontSize="xl" textAlign="left" ml={4} fontWeight="bold" letterSpacing={2}><NextLink href="/" >All Students</NextLink></Text>
      {!global.teacher.isAdmin ? null : (
              <Text fontSize="xl" textAlign="left" ml={4} fontWeight="bold" letterSpacing={2} borderTop="1px" borderBottom="1px" my={5} py={2}><NextLink href="/" >Teachers</NextLink></Text>

      )}
      <Accordion allowToggle onClick={handleClick} defaultIndex={+myStudentsAccordionState}>
        <AccordionItem>
          <h2>
            <AccordionButton fontSize="xl" fontWeight="bold" letterSpacing={2} border="none">
              <Box flex="1" textAlign="left">
                My Students {!global.myStudents ? null : "(" + global.myStudents.length + ")"}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} fontSize="xl">
            {!global.myStudents
              ? null
              : global.myStudents.map((student) => (
                  <Text py={1} key={student.id}>
                    <NextLink href="/student/[id]" as={`/student/${student.id}`}>
                      {student.fullName}
                    </NextLink>
                  </Text>
                ))}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  )
}
