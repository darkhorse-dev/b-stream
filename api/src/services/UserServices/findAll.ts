import { getManager } from 'typeorm'

import { User } from '../../entities'
import { logger } from '../../utils/logging'
import { isEmpty, promisify, filterEntity } from '../../utils'

/**
 * Find all users in db
 *
 * @returns {array} users
 */
type FindAllType = (
    query?: {
        [key: string]: any
    },
    filter?: boolean,
    fields?: string[]
) => Promise<object>
export const findAll: FindAllType = async (
    query = {},
    filter = true,
    fields = []
) => {
    const manager = getManager()

    const [users, usersErr] = await promisify(manager.find(User, query))
    if (usersErr) {
        logger('Find All User Service', usersErr, 500)

        return Promise.reject({ code: 500, message: usersErr.message })
    }

    if (!users || isEmpty(users)) {
        return Promise.resolve([])
    }

    if (filter) {
        return Promise.resolve(filterEntity(users, fields))
    }

    return Promise.resolve(users)
}
