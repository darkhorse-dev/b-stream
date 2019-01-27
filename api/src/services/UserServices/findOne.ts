import { User } from '../../entities'
import { logger } from '../../utils/logging'
import { isEmpty, promisify, filterEntity } from '../../utils'
import { getManager } from 'typeorm'

/**
 * Find one user in db by key, value
 *
 * return {object} user
 */
type FindOneType = (
    key: string,
    value: string | number,
    filter?: boolean,
    fields?: string[]
) => Promise<object>
export const findOne: FindOneType = async (
    key,
    value,
    filter = true,
    fields = []
) => {
    const manager = getManager()

    const [user, userErr] = await promisify(
        manager.findOne(User, { [key]: value })
    )
    if (userErr) {
        logger('Find One User Service', userErr, 500)

        return Promise.reject({ code: 500, message: userErr.message })
    }

    if (!user || isEmpty(user)) {
        return Promise.reject({ code: 404, message: 'User not found' })
    }

    if (filter) {
        return Promise.resolve(filterEntity(user, fields))
    }

    return Promise.resolve(user)
}
