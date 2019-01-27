import { getManager } from 'typeorm'

import { Track } from '../../entities'
import { logger } from '../../utils/logging'
import { isEmpty, promisify } from '../../utils'

/**
 * Create a new user record.
 *
 * @returns {string} new user id
 */
type CreateTrack = (newTrackData: Partial<Track>) => Promise<string | null>
export const create: CreateTrack = async newTrackData => {
    const manager = getManager()

    const tempTrack = new Track()
    Object.assign(tempTrack, newTrackData)

    const [newTrack, newTrackErr] = await promisify(
        manager.insert(Track, tempTrack)
    )
    if (newTrackErr) {
        if (newTrackErr.code === 'ER_DUP_ENTRY') {
            return Promise.reject({ code: 409, message: newTrackErr.message })
        }

        logger('Create Track Service', newTrackErr, 500)

        return Promise.reject({ code: 500, message: newTrackErr.message })
    }

    if (!newTrack || isEmpty(newTrack)) {
        return Promise.resolve(null)
    }

    return Promise.resolve(newTrack.identifiers[0].id)
}
