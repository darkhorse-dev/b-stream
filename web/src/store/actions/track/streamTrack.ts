import { Dispatch } from 'redux'

import request from '../../../utils/request'
import checkAPIHealth from '../../../utils/checkAPIHealth'
import { tracksEndpoint } from '../../../api/Endpoints'
import { STREAM_TRACK, TRACK_ERROR } from './types'
import { networkErrorMsg } from '../errorMessages'

export const streamTrack = (trackId: string) => async (dispatch: Dispatch) => {
    const error = await checkAPIHealth(async () => {
        const r = request()
        try {
            const response = await r.get(`${tracksEndpoint}/stream/${trackId}`)
            const track = response.data.response

            dispatch({
                type: STREAM_TRACK,
                payload: track,
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
