import { getManager } from 'typeorm'

import { Track } from '../../entities'
import { logger } from '../../utils/logging'
import { isEmpty, promisify, filterEntity } from '../../utils'

/**
 * Find one Track in db by key, value
 *
 * return {object} Track
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

    const [track, trackErr] = await promisify(
        manager.findOne(Track, { [key]: value })
    )
    if (trackErr) {
        logger('Find One Track Service', trackErr, 500)

        return Promise.reject({ code: 500, message: trackErr.message })
    }

    if (!track || isEmpty(track)) {
        return Promise.reject({ code: 404, message: 'Track not found' })
    }

    if (filter) {
        return Promise.resolve(filterEntity(track, fields))
    }

    return Promise.resolve(track)
}
