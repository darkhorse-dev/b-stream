export default class APIError extends Error {
    public message: string | 'Something went wrong, please try again.'
    public code: number | 500
    constructor(message: string, code: number) {
        super(message)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor)

        this.message = message
        this.code = code
    }
}
