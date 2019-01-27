import * as passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

import { UserServices } from '../services/UserServices'
import { logger } from '../utils/logging'
import { promisify, isEmpty } from '../utils'

export const localLogin = new LocalStrategy(
    { usernameField: 'email' },
    async (email: string, _: any, done: any) => {
        const [user, userErr] = await promisify(
            UserServices.findOne('email', email)
        )
        if (userErr) {
            logger('Error In Passport Local Login', userErr, 500)

            return done(null, false)
        }

        if (!user || isEmpty(user)) {
            return done(null, false)
        }

        return done(null, user)
    }
)

/**
 * For server.js to initiate passport
 */
export const passportConfig = () => {
    passport.use(localLogin)

    passport.serializeUser((user, done) => {
        return done(null, user)
    })

    passport.deserializeUser(async (id, done) => {
        const [user, userErr] = await promisify(
            UserServices.findOne('id', id.toString())
        )

        if (userErr) {
            logger('Error In Passport Deserialize', userErr, 500)

            return done(null, false)
        }

        if (!user || isEmpty(user)) {
            return done(null, false)
        }

        return done(null, user)
    })
}
