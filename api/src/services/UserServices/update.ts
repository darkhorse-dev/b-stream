import { getManager } from 'typeorm'

import { logger } from '../../utils/logging'
import { promisify, filterEntity } from '../../utils'
import { User } from '../../entities'

/**
 * Update user in db
 *
 * @returns {object} updated user
 */
type UpdateType = (
    user: User,
    data: Partial<User>,
    filter?: boolean,
    fields?: string[]
) => Promise<object | null>
export const update: UpdateType = async (
    user,
    data,
    filter = true,
    fields = []
) => {
    const manager = getManager()
    const tempUser = new User()
    Object.assign(tempUser, user, data)

    const [updatedUser, updatedUserErr] = await promisify(
        manager.save(User, tempUser)
    )
    if (updatedUserErr) {
        logger('Update User Service', updatedUserErr, 500)

        return Promise.reject({ code: 500, message: updatedUserErr.message })
    }

    if (!updatedUser) {
        return Promise.resolve(null)
    }

    if (filter) {
        return Promise.resolve(filterEntity(updatedUser, fields))
    }

    return Promise.resolve(updatedUser)
}
