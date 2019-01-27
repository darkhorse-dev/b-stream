import { Request, Response, NextFunction } from 'express'
import { body, param, validationResult, query } from 'express-validator/check'

import { code422 } from '../../utils/httpMessages'
import { passwordRegex, passwordValidationMessage } from '../../entities/User'
import UserSchema from '../../schemas/UserSchema'

export const validationRules = {
    createUser: [
        ...UserSchema.map((field: string) =>
            body(field)
                .escape()
                .trim()
        ),
        body('userName')
            .not()
            .isEmpty()
            .withMessage('is required')
            .trim()
            .escape(),
        body('email')
            .not()
            .isEmpty()
            .withMessage('is required')
            .trim()
            .isEmail()
            .withMessage('is not a valid email address')
            .escape()
            .normalizeEmail(),
        body('password')
            .not()
            .isEmpty()
            .withMessage('is required')
            .trim()
            .escape()
            .matches(passwordRegex)
            .withMessage(passwordValidationMessage),
    ],
    getUser: [
        param('id')
            .not()
            .isEmpty()
            .trim()
            .escape()
            .withMessage('is required for this endpoint'),
    ],
    updateUser: [
        ...UserSchema.map((field: string) =>
            body(field)
                .escape()
                .trim()
        ),
        param('id')
            .not()
            .isEmpty()
            .trim()
            .escape()
            .withMessage('is required for this endpoint'),
        body('email')
            .optional()
            .trim()
            .isEmail()
            .withMessage('is not a valid email address')
            .escape()
            .normalizeEmail(),
        body('password')
            .optional()
            .trim()
            .escape()
            .matches(passwordRegex)
            .withMessage(passwordValidationMessage),
    ],
    deleteUser: [
        param('id')
            .not()
            .isEmpty()
            .trim()
            .escape()
            .withMessage('is required for this endpoint'),
    ],
    seeder: [
        query('amount')
            .not()
            .isEmpty()
            .trim()
            .escape()
            .withMessage('is required for this endpoint'),
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
