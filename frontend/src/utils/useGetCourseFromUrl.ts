import { useRouter } from "next/router"
import { useCourseQuery } from "../generated/graphql"

export const useGetCourseFromUrl = () => {
    const router = useRouter()
    const intId = typeof router.query.id === 'string' ? +router.query.id : -1
    return useCourseQuery({
    pause: intId === -1, // If we don't have an id, then stop the query.
    variables: {
        id: intId
    }
    
})
}