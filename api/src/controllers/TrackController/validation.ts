import { Request, Response, NextFunction } from 'express'
import { param, validationResult, body } from 'express-validator/check'

import { code422 } from '../../utils/httpMessages'
import TrackSchema from '../../schemas/TrackSchema'

export const validationRules = {
    streamTrack: [
        param('id')
            .not()
            .isEmpty()
            .trim()
            .escape()
            .withMessage('is required for this endpoint'),
    ],
    getTrack: [
        param('id')
            .not()
            .isEmpty()
            .trim()
            .escape()
            .withMessage('is required for this endpoint'),
    ],
    getUserTracks: [
        param('id')
            .not()
            .isEmpty()
            .trim()
            .escape()
            .withMessage('is required for this endpoint'),
    ],
    uploadTrack: [
        ...TrackSchema.map((field: string) =>
            body(field)
                .escape()
                .trim()
        ),
        body('name')
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
