import { DeleteIcon } from '@chakra-ui/icons'
import { Badge, Box, Button, Divider, Flex, FormControl, FormLabel, IconButton, Input, Stack, Textarea, useColorModeValue } from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateCourseMutation, useDeleteCourseMutation, useUpdateCourseMutation } from '../generated/graphql'
const EditStudentCard = ({name, grade, feedback, id, student, hideNewCourseCard, teacher, teacherName}) => {

    const navigate = useNavigate()
    const  [courseName, setCourseName] = useState(name)
    const [courseGrade, setCourseGrade] = useState(grade)
    const [courseFeedback, setFeedback] = useState(feedback)

    const [updatedCourse, setUpdateCourse] = useUpdateCourseMutation()
    const [createdCourse, createCourse] = useCreateCourseMutation()
    const [_, deleteCourse] = useDeleteCourseMutation()

    const handleCourseNameUpdate = (e) => {
        setCourseName(e.target.value)
    }

    const handleCourseGradeUpdate = (e) => {
        setCourseGrade(e.target.value)
    }

    const handleFeedbackUpdate = (e) => {
      setFeedback(e.target.value)
    }

    const handleFormSubmission = async () => {
        await setUpdateCourse({
            name: courseName,
            grade: courseGrade,
            feedback: courseFeedback,
            id: +id
        })
    }

    const handleCreateNewCourse = async () => {
        await createCourse({
            name: courseName,
            grade: courseGrade,
            feedback: courseFeedback,
            student: +student,
            teacher: +teacher
        })

        hideNewCourseCard()



    }

    const handleDeleteCourse = () => {
      deleteCourse({id})
    }
    return (
        <Box as="form" bg="bg-surface" boxShadow={useColorModeValue("sm", "sm-dark")} borderRadius="lg">
          <Badge borderRadius={0} p={5}>Teacher: {teacherName}</Badge>
        <Stack spacing="5" px={{ base: "4", md: "6" }} py={{ base: "5", md: "6" }}>
          
          <Stack spacing="6" direction={{ base: "column", md: "row" }}>
            <FormControl id="name">
              <FormLabel>Name</FormLabel>
              <Input defaultValue={courseName} onChange={handleCourseNameUpdate} />
            </FormControl>
            <FormControl id="grade" onChange={handleCourseGradeUpdate}>
              <FormLabel>Grade</FormLabel>
              <Input defaultValue={courseGrade} />
            </FormControl>

          </Stack>
          <FormControl id="feedback">
              <FormLabel>Feedback</FormLabel>
              <Textarea value={courseFeedback || null} onChange={handleFeedbackUpdate} />
            </FormControl>
        </Stack>
        <Divider />
        <Flex direction="row-reverse" py="4" px={{ base: "4", md: "6" }}>
          <Button variant="primary" onClick={(id) ? handleFormSubmission : handleCreateNewCourse} isLoading={updatedCourse.fetching || createdCourse.fetching}>Save</Button>
          <IconButton icon={<DeleteIcon />} variant="ghost" mr={'auto'} aria-label='Delete Course' colorScheme="red" onClick={handleDeleteCourse}>Delete</IconButton>

        </Flex>
      </Box>
    )
}
export default EditStudentCard