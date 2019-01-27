import APIError from './APIError'

export default class UserExistsError extends APIError {
    constructor(message: string, code: number) {
        super(message || 'This user already exists!', code || 409)
    }
}
