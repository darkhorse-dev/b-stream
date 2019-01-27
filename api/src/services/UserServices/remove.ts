import { getManager } from 'typeorm'

import { logger } from '../../utils/logging'
import { promisify } from '../../utils'
import { User } from '../../entities'

/**
 * Remove one user in db by id
 *
 * @param {entity} user - instance to be deleted.
 *
 * @returns {string}
 */
type RemoveType = (userId: string) => Promise<any>
export const remove: RemoveType = async userId => {
    const manager = getManager()

    const [, removeUserErr] = await promisify(manager.delete(User, userId))
    if (removeUserErr) {
        logger('Remove User Service', removeUserErr, 500)

        return Promise.reject({ code: 500, message: removeUserErr.message })
    }

    return Promise.resolve(null)
}
