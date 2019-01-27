import { Dispatch } from 'redux'

import request from '../../../utils/request'
import checkAPIHealth from '../../../utils/checkAPIHealth'
import { tracksEndpoint } from '../../../api/Endpoints'
import { GET_TRACKS, TRACK_ERROR } from './types'
import { networkErrorMsg } from '../errorMessages'

export const getTracks = () => async (dispatch: Dispatch) => {
    const error = await checkAPIHealth(async () => {
        const r = request()
        try {
            const response = await r.get(tracksEndpoint)
            const tracks = response.data.response

            dispatch({
                type: GET_TRACKS,
                payload: tracks,
            })
        } catch (error) {
            dispatch({ type: TRACK_ERROR, payload: error.response.data })
        }
    })

    if (error) {
        dispatch({
            type: TRACK_ERROR,
            payload: networkErrorMsg,
        })
    }
}
