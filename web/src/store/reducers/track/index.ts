import {
    TRACK_UPLOAD,
    TRACK_ERROR,
    STREAM_TRACK,
    GET_TRACKS,
} from '../../actions/track/types'
import {
    badDataErrorMsg,
    genericErrorMsg,
    authErrorMsg,
    trackNotFoundErrorMsg,
    fileToBigErrorMsg,
} from './errorMessages'
import { ErrorPayloadType, ReducerType } from '../../../interfaces'

export default (state = {}, { type, payload }: ReducerType) => {
    switch (type) {
        case STREAM_TRACK: {
            return payload
        }
        case GET_TRACKS: {
            return payload
        }
        case TRACK_UPLOAD: {
            return payload
        }
        case TRACK_ERROR: {
            const {
                status,
                message,
                fields,
            }: Partial<ErrorPayloadType> = payload
            switch (status) {
                case 401: {
                    return authErrorMsg()
                }
                case 404: {
                    return trackNotFoundErrorMsg()
                }
                case 413: {
                    return fileToBigErrorMsg({ message })
                }
                case 422: {
                    return badDataErrorMsg(fields)
                }
                default: {
                    return genericErrorMsg()
                }
            }
        }
        default: {
            return state
        }
    }
}
