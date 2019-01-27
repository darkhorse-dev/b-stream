import APIError from './APIError'

export default class BadRequestError extends APIError {
    constructor(message: string, code: number) {
        super(message || 'The data sent is invalid!', code || 422)
    }
}
