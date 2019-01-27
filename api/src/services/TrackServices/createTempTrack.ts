import { createWriteStream, access, constants } from 'fs'
import { normalize, resolve } from 'path'
import { Readable } from 'stream'

import { formattedUUID } from '../../utils'

const baseDir = normalize(resolve(__dirname, '..', '..', '..'))
const tempDir = `${baseDir}/temp`

export interface TempTrackData {
    data: Buffer
    name: string
    encoding: string
    mimetype: string
    truncated: boolean
    size: number
}

export interface TrackData {
    fileName: string
    fileExt: string
    fileSize: number
}

export const createTempTrack = async (
    tempTrackData: TempTrackData
): Promise<any> => {
    const trackName = formattedUUID()
    const trackExt = tempTrackData.mimetype.split('/')[1]
    const tempTrackFile = `${tempDir}/${trackName}.${trackExt}`

    const trackData: TrackData = {
        fileName: trackName,
        fileExt: trackExt,
        fileSize: tempTrackData.size,
    }

    const stream = createWriteStream(tempTrackFile)
    const readable = new Readable()
    readable.push(tempTrackData.data)
    readable.push(null)
    readable
        .pipe(stream)
        .on('data', (data: any) => console.log('Creating', data))
        .on('error', (error: any) => {
            console.error(error)
            stream.end()
            readable.destroy()

            return Promise.reject(error)
        })
        .on('finish', () => {
            stream.end()
            readable.destroy()
        })
        .on('close', () => {
            stream.destroy()
            readable.destroy()
        })

    access(tempTrackFile, constants.F_OK, err => {
        if (err) {
            Promise.reject({
                code: 404,
                message: `${trackData.fileName}.${
                    trackData.fileExt
                } does not exist`,
            })
        }
    })

    return Promise.resolve(trackData)
}
