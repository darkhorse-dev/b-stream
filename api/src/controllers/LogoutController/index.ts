import { Router, NextFunction } from 'express'

import { requireLogin, logout } from '../../middleware'

class LogoutController {
    public router: Router

    constructor() {
        this.router = Router()
        this.routes()
    }

    public routes() {
        this.router.post('/', requireLogin, logout, this.logout)
    }

    private logout = (next: NextFunction): any => {
        return next()
    }
}

export default new LogoutController().router
