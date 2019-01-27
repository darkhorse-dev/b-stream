import { Dispatch } from 'redux'

import request from '../../../utils/request'
import checkAPIHealth from '../../../utils/checkAPIHealth'
import { loginEndpoint } from '../../../api/Endpoints'
import { BASIC_AUTH_LOGIN, BASIC_AUTH_ERROR } from './types'
import { networkErrorMsg } from '../errorMessages'

interface UserLoginType {
    email: string
    password: string
    rememberMe: boolean
}

export const basicLogin = ({
    email,
    password,
    rememberMe,
}: UserLoginType) => async (dispatch: Dispatch) => {
    const error = await checkAPIHealth(async () => {
        const r = request()
        try {
            const data = JSON.stringify({ email, password, rememberMe })
            const response = await r.post(loginEndpoint, data)
            const user = response.data.response

            localStorage.setItem('user', JSON.stringify(user))

            dispatch({
                type: BASIC_AUTH_LOGIN,
                payload: user,
            })
        } catch (error) {
            dispatch({ type: BASIC_AUTH_ERROR, payload: error.response.data })
        }
    })

    if (error) {
        dispatch({
            type: BASIC_AUTH_ERROR,
            payload: networkErrorMsg,
        })
    }
}
