import { Request, Response, NextFunction } from 'express'

import { logger } from '../utils/logging'
import * as httpMessages from '../utils/httpMessages'

export const gate = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err) {
        logger(req.ip, err, req.statusCode)

        return res.status(500).json(httpMessages.code500())
    }

    return next()
}
