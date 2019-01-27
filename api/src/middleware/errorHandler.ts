import { Request, Response, NextFunction } from 'express'

import { logger } from '../utils/logging'
import * as httpMessages from '../utils/httpMessages'

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    _: NextFunction
) => {
    if (err) {
        logger(req.ip, req.statusMessage, req.statusCode)

        return res.status(500).json(httpMessages.code500())
    }

    return res.status(404).json(httpMessages.code404())
}
