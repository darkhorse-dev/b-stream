import { Dispatch } from 'redux'

import request from '../../../utils/request'
import checkAPIHealth from '../../../utils/checkAPIHealth'
import { usersEndpoint } from '../../../api/Endpoints'
import { BASIC_AUTH_REGISTER, BASIC_AUTH_ERROR } from './types'
import { networkErrorMsg } from '../errorMessages'

interface UserRegisterType {
    userName: string
    email: string
    password: string
}

export const basicRegister = ({
    userName,
    email,
    password,
}: UserRegisterType) => async (dispatch: Dispatch) => {
    const error = await checkAPIHealth(async () => {
        const r = request()
        try {
            const data = JSON.stringify({ userName, email, password })
            const response = await r.post(usersEndpoint, data)
            const user = response.data.response

            localStorage.setItem('user', JSON.stringify(user))

            dispatch({
                type: BASIC_AUTH_REGISTER,
                payload: user,
            })
        } catch (error) {
            dispatch({
                type: BASIC_AUTH_ERROR,
                payload: error.response.data,
            })
        }
    })

    if (error) {
        dispatch({
            type: BASIC_AUTH_ERROR,
            payload: networkErrorMsg,
        })
    }
}
