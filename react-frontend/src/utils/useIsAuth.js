import { useCheckLoginQuery } from '../generated/graphql'
import  React, {useEffect} from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {useRecoilState} from 'recoil'
import {loggedInUser} from '../atom'
export const useIsAuth = () => {
    let navigate = useNavigate()
    const url = useLocation();
    const [me, executeMeQuery] = useCheckLoginQuery()
    const [user, setUser] = useRecoilState(loggedInUser)
    useEffect(() => {
        if (user === null && !me.fetching && me.data.authenticatedItem){
            setUser(me.data.authenticatedItem)
        } else if(user === null && !me.fetching && !me.data.authenticatedItem) {
            navigate('/login')
        }

    }, [me.data])
}