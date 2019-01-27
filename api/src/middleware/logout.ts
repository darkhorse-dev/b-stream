import { Response } from 'express'

import { ExtendedRequest } from '../interfaces/ExtendedRequest'

export const logout = (req: ExtendedRequest, res: Response) => {
    req.logout()
    if (req.session) {
        req.session.destroy(() => {
            //
        })
    }

    return res.sendStatus(204)
}
