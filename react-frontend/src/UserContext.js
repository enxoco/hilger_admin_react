import  React, { createContext, useState} from 'react'
import axios from 'axios'
import {useCheckLoginQuery} from './generated/graphql'
export const UserContext = createContext(null)

export const UserProvider = (props) => {

    const [state, setState] = useState({

    })
    const [loginState, getLoginState] = useCheckLoginQuery()


    return <UserContext.Provider value={{state, setState, loginState, getLoginState}}>{props.children}</UserContext.Provider>
}