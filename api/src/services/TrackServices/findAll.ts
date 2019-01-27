import { getManager } from 'typeorm'

import { Track } from '../../entities'
import { logger } from '../../utils/logging'
import { isEmpty, promisify, filterEntity } from '../../utils'

/**
 * Find all tracks in db
 *
 * @returns {array} tracks
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

    const [tracks, tracksErr] = await promisify(manager.find(Track, query))
    if (tracksErr) {
        logger('Find All Track Service', tracksErr, 500)

        return Promise.reject({ code: 500, message: tracksErr.message })
    }

    if (!tracks || isEmpty(tracks)) {
        return Promise.resolve([])
    }

    if (filter) {
        return Promise.resolve(filterEntity(tracks, fields))
    }

    return Promise.resolve(tracks)
}
