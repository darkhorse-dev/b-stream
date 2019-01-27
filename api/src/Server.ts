import * as compression from 'compression'
import * as express from 'express'
import * as morgan from 'morgan'
import * as helmet from 'helmet'
import * as cors from 'cors'
import * as passport from 'passport'
import * as rateLimit from 'express-rate-limit'
import * as busboy from 'connect-busboy'
import * as busboyBodyParser from 'busboy-body-parser'

import { controllers } from './controllers'
import {
    passportConfig,
    redisSession,
    gate,
    errorHandler,
    contentType,
} from './middleware'

morgan.token('id', req => req.ip)

class Server {
    public app: express.Application

    constructor() {
        this.app = express()
        this.config()
        this.routes()
    }

    private config() {
        if (process.env.NODE_ENV === 'production') {
            this.app.enable('trust proxy')
        }
        this.app.disable('x-powered-by')
        this.app.use(
            new rateLimit({
                windowMs: 15 * 60 * 1000, // 15 mins
                max: 100, // upto 100 requests every 15 mins
                message: {
                    status: 429,
                    error: 'To many requests',
                    message: 'To many requests, please try again later',
                },
            })
        )
        this.app.use(helmet())
        this.app.use(
            cors({
                credentials: true,
                origin: String(process.env.WEB_CLIENT_URL),
            })
        )
        this.app.use(
            busboy({
                immediate: true,
                highWaterMark: 2 * 1024 * 1024, // 2mb
                limits: {
                    fileSize: 10 * 1024 * 1024, // 10mb
                },
            })
        )
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }))
        this.app.use(express.json({ limit: '10mb' }))
        this.app.use(busboyBodyParser())
        this.app.use(compression())
        const loggerFormat =
            ':id [:date[web]] ":method :url" :status :response-time'
        this.app.use(
            morgan(loggerFormat, {
                stream: process.stderr,
            })
        )
        passportConfig()
        this.app.use(redisSession())
        this.app.use(passport.initialize())
        this.app.use(passport.session())
    }

    private routes() {
        const router = express.Router()

        // Handle bad request payloads etc
        this.app.use(gate)

        this.app.use('/v1', router)

        // Only allow specific content types
        router.use(contentType)

        router.get('/health', (_, res) => res.sendStatus(200))
        router.use('/login', controllers.LoginController)
        router.use('/logout', controllers.LogoutController)
        router.use('/users', controllers.UserController)
        router.use('/tracks', controllers.TrackController)

        // To prevent 404 if using the API in browser
        const noContentUrls = ['/favicon.ico', '/robots.txt']
        noContentUrls.forEach(url => {
            router.all(url, (_, res) => res.sendStatus(204))
        })

        // Catch straggling errors
        this.app.use(errorHandler)
    }
}

export default new Server().app
