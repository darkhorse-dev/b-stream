import { Dispatch } from 'redux'

import request from '../../../utils/request'
import checkAPIHealth from '../../../utils/checkAPIHealth'
import { logoutEndpoint } from '../../../api/Endpoints'
import { LOGOUT, BASIC_AUTH_ERROR } from './types'
import { networkErrorMsg } from '../errorMessages'

export const logout = () => async (dispatch: Dispatch) => {
    const error = await checkAPIHealth(async () => {
        const r = request()
        try {
            localStorage.removeItem('user')

            const response = await r.post(logoutEndpoint, {})
            const user = response.data.response

            dispatch({
                type: LOGOUT,
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
