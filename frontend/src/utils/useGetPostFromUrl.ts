import { useRouter } from "next/router"
import { usePostQuery } from "../generated/graphql"

export const useGetPostFromUrl = () => {
    const router = useRouter()
    const intId = typeof router.query.id === 'string' ? +router.query.id : -1
    return usePostQuery({
    pause: intId === -1, // If we don't have an id, then stop the query.
    variables: {
        id: intId
    }
    
})
}