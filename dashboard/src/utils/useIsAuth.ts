import { useRouter } from "next/router"
import { useEffect } from "react"
import { useMeQuery } from "../generated/graphql"

export const useIsAuth = () => {
  const [{ data, fetching }] = useMeQuery()
  const router = useRouter()
  useEffect(() => {
    // If user is not logged in, redirect to login page.
    if (!fetching && !data?.me) {
      router.replace("/login?next=" + router.pathname)
    }
  }, [fetching, data, router])
}
