import { Dispatch } from 'redux'

import request from '../../../utils/request'
import checkAPIHealth from '../../../utils/checkAPIHealth'
import { tracksEndpoint } from '../../../api/Endpoints'
import { TRACK_UPLOAD, TRACK_ERROR } from './types'
import { networkErrorMsg, fileToBigErrorMsg } from '../errorMessages'
import { TrackUpload } from '../../../interfaces'

const MAX_FILESIZE = 10 * 1024 * 1024

export const uploadTrack = (trackData: TrackUpload) => async (
    dispatch: Dispatch
) => {
    // @ts-ignore
    const fileSize = trackData.get('file').size
    if (fileSize > MAX_FILESIZE) {
        return dispatch({ type: TRACK_ERROR, payload: fileToBigErrorMsg })
    }

    const error = await checkAPIHealth(async () => {
        const r = request({
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        try {
            const response = await r.post(tracksEndpoint, trackData)
            const track = response.data.response

            dispatch({
                type: TRACK_UPLOAD,
                payload: track,
            })
        } catch (error) {
            dispatch({ type: TRACK_ERROR, payload: error.response.data })
        }
    })

    if (error) {
        return dispatch({
            type: TRACK_ERROR,
            payload: networkErrorMsg,
        })
    }

    return
}
