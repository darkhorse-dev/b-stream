import { Request } from 'express'

export interface ExtendedRequest extends Request {
    [key: string]: any
}
