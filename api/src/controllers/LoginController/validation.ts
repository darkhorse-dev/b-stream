import { Request, Response, NextFunction } from 'express'
import { body, validationResult } from 'express-validator/check'

import { code422 } from '../../utils/httpMessages'

export const validationRules = {
    basicLogin: [
        body('email')
            .not()
            .isEmpty()
            .withMessage('is required')
            .trim()
            .isEmail()
            .withMessage('is not a valid email address')
            .escape(),
        body('password')
            .not()
            .isEmpty()
            .withMessage('is required')
            .trim()
            .escape(),
    ],
}

export function validationFunc(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errString = errors
            .array()
            .map((err: any) => `${err.param}: ${err.msg}`)
            .join(', ')

        const fields: string[] = [
            ...new Set(errors.array().map((err: any) => err.param)),
        ]

        return res.status(422).json(code422(undefined, errString, fields))
    }

    return next()
}
