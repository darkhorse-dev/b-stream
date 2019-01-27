import { normalize, resolve } from 'path'
import * as shell from 'shelljs'

import { TrackData } from './createTempTrack'
import { logger } from '../../utils/logging'

const baseDir = normalize(resolve(__dirname, '..', '..', '..'))
const tempDir = `${baseDir}/temp`
const storageDir = `${baseDir}/storage`

export const createPermTrack = async (trackData: TrackData) => {
    if (!shell.which('ffmpeg')) {
        shell.echo('Sorry, this script requires ffmpeg')

        shell.exit(1)
        process.exit(1)
    }

    const { fileName, fileExt } = trackData
    const tempTrackFile = `${tempDir}/${fileName}.${fileExt}`
    const destTrackFile = `${storageDir}/${fileName}.${fileExt}`
    /*const tempTrackFileConverted = `${tempDir}/${fileName}-converted.${fileExt}`
    const command = `./ffmpeg.sh ${tempDir}/${fileName} ${fileExt}`
    try {
        shell.cd(baseDir)
        shell.exec(
            command,
            { async: true, silent: false },
            (code, stdout, stderr) => {
                if (code !== 0) {
                    shell.rm(tempTrackFile)

                    logger('FFMpeg Error', stdout.toString(), 500)

                    return Promise.reject(stderr.toString())
                }

                shell.mv(tempTrackFileConverted, destTrackFile)
                shell.rm(tempTrackFile)

                return Promise.resolve(destTrackFile)
            }
        )
    } catch (err) {
        throw new Error(err.toString())
    }*/

    try {
        shell.mv(tempTrackFile, destTrackFile)
    } catch (err) {
        logger('Create perm track error', err, 500)

        throw new Error(err.toString())
    }

    return Promise.resolve(destTrackFile)
}
