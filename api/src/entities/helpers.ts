import { validate } from 'class-validator'

export async function validateData<T>(data: Partial<T>) {
    try {
        const errors = await validate(data, { skipMissingProperties: true })
        if (errors.length > 0) {
            throw new TypeError(errors.toString())
        }
    } catch (err) {
        throw new Error(err.toString())
    }
}
