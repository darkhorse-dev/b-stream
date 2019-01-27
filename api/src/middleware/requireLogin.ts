import { Response, NextFunction } from 'express'

import { ExtendedRequest } from '../interfaces/ExtendedRequest'
import * as httpMessages from '../utils/httpMessages'

export const requireLogin = (
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
) => {
    if (req.isAuthenticated()) {
        return next()
    }

    return res.status(401).json(httpMessages.code401())
}
