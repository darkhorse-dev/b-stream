import { getManager } from 'typeorm'

import { User } from '../../entities'
import { logger } from '../../utils/logging'
import { isEmpty, promisify } from '../../utils'

/**
 * Create a new user record.
 *
 * @returns {string} new user id
 */
type CreateType = (newUserData: object) => Promise<string | null>
export const create: CreateType = async newUserData => {
    const manager = getManager()

    const tempUser = new User()
    Object.assign(tempUser, newUserData)

    const [newUser, newUserErr] = await promisify(
        manager.insert(User, tempUser)
    )
    if (newUserErr) {
        if (newUserErr.code === 'ER_DUP_ENTRY') {
            return Promise.reject({ code: 409, message: newUserErr.message })
        }

        logger('Create User Service', newUserErr, 500)

        return Promise.reject({ code: 500, message: newUserErr.message })
    }

    if (!newUser || isEmpty(newUser)) {
        return Promise.resolve(null)
    }

    return Promise.resolve(newUser.identifiers[0].id)
}
