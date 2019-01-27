import { Router, Response, NextFunction } from 'express'

import * as httpMessages from '../../utils/httpMessages'
import { logger } from '../../utils/logging'
import { UserServices } from '../../services/UserServices'
import { validationRules, validationFunc } from './validation'
import seedUsers from '../../database/seeders/seedUsers'
import { promisify, pick, escapeString } from '../../utils'
import UserSchema from '../../schemas/UserSchema'
import { ExtendedRequest } from '../../interfaces/ExtendedRequest'
import { requireLogin, logout } from '../../middleware'

class UserController {
    public router: Router

    constructor() {
        this.router = Router()
        this.routes()
    }

    public routes() {
        this.router.get('/', this.getUsers)
        this.router.get('/me', requireLogin, this.me)
        this.router.post(
            '/seed',
            [...validationRules.seeder],
            validationFunc,
            this.seeder
        )
        this.router.post(
            '/',
            [...validationRules.createUser],
            validationFunc,
            this.createUser
        )
        this.router.get(
            '/:id',
            [...validationRules.getUser],
            validationFunc,
            this.getUser
        )
        this.router.patch(
            '/:id',
            [...validationRules.updateUser],
            validationFunc,
            requireLogin,
            this.updateUser
        )
        this.router.delete(
            '/:id',
            [...validationRules.deleteUser],
            validationFunc,
            requireLogin,
            this.deleteUser,
            logout
        )
    }

    /**
     * Returns currently logged in user
     */
    private me = (req: ExtendedRequest, res: Response) => {
        return res.status(200).json(httpMessages.code200(req.user))
    }

    /**
     * Seeds db with users,
     *
     * @field {number} amount of users to create
     */
    private seeder = async (
        req: ExtendedRequest,
        res: Response
    ): Promise<any> => {
        const amountOfUsers = Number(escapeString(req.query.amount))

        await seedUsers(amountOfUsers)

        const [users, usersErr] = await promisify(UserServices.findAll())
        if (usersErr) {
            logger(req.ip, usersErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        const message = `${amountOfUsers} users created. There are ${
            users.length
        } users now in DB.`

        return res.status(200).json(httpMessages.code200({}, message))
    }

    /**
     * Creates a user with required fields
     *
     * @field userName
     * @field email
     * @field password
     */
    private createUser = async (
        req: ExtendedRequest,
        res: Response
    ): Promise<any> => {
        // Filter sent data based on schema
        const filteredData = pick(req.body, UserSchema)
        const data = {}
        for (const key in filteredData) {
            if (filteredData.hasOwnProperty(key)) {
                data[key] = escapeString(filteredData[key])
            }
        }

        /**
         * Create & save new user
         */
        const [userId, userIdErr] = await promisify(
            UserServices.create(filteredData)
        )
        if (userIdErr) {
            if (Number(userIdErr.code) === 409) {
                logger(req.ip, userIdErr, 409)

                return res.status(409).json(httpMessages.code409())
            }

            logger(req.ip, userIdErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        /**
         * Find new user
         */
        const [newUser, newUserErr] = await promisify(
            UserServices.findOne('id', userId)
        )
        if (newUserErr) {
            logger(req.ip, newUserErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        /**
         * Login user, send user info back
         */
        req.login(newUser.id, (err: any) => {
            if (err) {
                logger(req.ip, err, 500)

                return res.status(500).json(httpMessages.code500())
            }

            req.session!.user = newUser.id
            res.setHeader('XSRF-TOKEN', String(req.sessionID))

            return res.status(201).json(httpMessages.code201(newUser))
        })

        return
    }

    /**
     * Returns a single user object
     */
    private getUser = async (
        req: ExtendedRequest,
        res: Response
    ): Promise<any> => {
        const userId = escapeString(req.params.id)
        const [user, userErr] = await promisify(
            UserServices.findOne('id', userId)
        )
        if (userErr) {
            if (userErr.code === 404) {
                logger(req.ip, userErr, 404)

                return res.status(404).json(httpMessages.code404())
            }

            logger(req.ip, userErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        return res.status(200).json(httpMessages.code200(user))
    }

    /**
     * Returns an array of users
     */
    private getUsers = async (
        req: ExtendedRequest,
        res: Response
    ): Promise<any> => {
        const [users, usersErr] = await promisify(UserServices.findAll())
        if (usersErr) {
            logger(req.ip, usersErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        return res.status(200).json(httpMessages.code200(users))
    }

    /**
     * Updates a user
     */
    private updateUser = async (
        req: ExtendedRequest,
        res: Response
    ): Promise<any> => {
        const userId = escapeString(req.params.id)

        // Check if logged in user is the same as requested user
        if (req.user.id !== userId) {
            return res.status(403).json(httpMessages.code403())
        }

        const [originalUser, originalUserErr] = await promisify(
            UserServices.findOne('id', userId, false)
        )
        if (originalUserErr) {
            if (originalUserErr.code === 404) {
                logger(req.ip, originalUserErr, 404)

                return res.status(404).json(httpMessages.code404())
            }

            logger(req.ip, originalUserErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        // Filter sent data based on schema
        const filteredData = pick(req.body, UserSchema)
        const newData = {}
        for (const key in filteredData) {
            if (filteredData.hasOwnProperty(key)) {
                newData[key] = escapeString(filteredData[key])
            }
        }

        /**
         * Save updated user
         */
        const [updatedUser, updatedUserErr] = await promisify(
            UserServices.update(originalUser, newData)
        )
        if (updatedUserErr) {
            logger(req.ip, updatedUserErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        return res
            .status(200)
            .json(
                httpMessages.code200(updatedUser, 'User successfully updated.')
            )
    }

    /**
     * Deletes user found by id
     */
    private deleteUser = async (
        req: ExtendedRequest,
        res: Response,
        next: NextFunction
    ): Promise<any> => {
        const userId = escapeString(req.params.id)

        // Check if logged in user is the same as requested user
        if (req.user.id !== userId) {
            return res.status(403).json(httpMessages.code403())
        }

        /**
         * Find user
         */
        const [user, userErr] = await promisify(
            UserServices.findOne('id', userId)
        )
        if (userErr) {
            if (userErr.code === 404) {
                logger(req.ip, userErr, 404)

                return res.status(404).json(httpMessages.code404())
            }

            logger(req.ip, userErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        if (!user) {
            return res.status(404).json(httpMessages.code404())
        }
        /**
         * Remove user
         */
        const [, deleteUserErr] = await promisify(
            await UserServices.remove(userId)
        )
        if (deleteUserErr) {
            logger(req.ip, deleteUserErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        return next()
    }
}

export default new UserController().router
