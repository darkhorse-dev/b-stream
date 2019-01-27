import {
    BASIC_AUTH_ERROR,
    BASIC_AUTH_REGISTER,
    BASIC_AUTH_LOGIN,
    LOGOUT,
} from '../../actions/user/types'
import {
    badDataErrorMsg,
    genericErrorMsg,
    userNotFoundErrorMsg,
    invalidCredentialsMsg,
    duplicateUserMsg,
} from './errorMessages'
import { ErrorPayloadType, ReducerType } from '../../../interfaces'

export default (state = {}, { type, payload }: ReducerType) => {
    switch (type) {
        case BASIC_AUTH_REGISTER: {
            return payload
        }
        case BASIC_AUTH_LOGIN: {
            return payload
        }
        case LOGOUT: {
            return {}
        }
        case BASIC_AUTH_ERROR: {
            const {
                status,
                fields,
                message,
            }: Partial<ErrorPayloadType> = payload
            switch (status) {
                case 401: {
                    return invalidCredentialsMsg()
                }
                case 404: {
                    return userNotFoundErrorMsg()
                }
                case 409: {
                    return duplicateUserMsg()
                }
                case 422: {
                    if (fields && fields.includes('password')) {
                        const moddedMessage = `Please check your password: ${
                            message!.split('password:')[1]
                        }`
                        return badDataErrorMsg(fields, {
                            message: moddedMessage,
                        })
                    }

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
