import { normalize, resolve } from 'path'
import * as bunyan from 'bunyan'
import * as RotatingFileStream from 'bunyan-rotating-file-stream'

const logSettings = {
    period: '1d', // daily rotation
    totalFiles: 2, // keep 2 back copies
    threshold: '10m', // Rotate log files larger than 10 megabytes
    totalSize: '20m', // Don't keep more than 20mb of archived log files
    rotateExisting: true, // Give ourselves a clean file when we start up, based on period
    gzip: true, // Compress the archive log files to save space
    startNewFile: true,
}

const projectBaseDir = normalize(resolve(__dirname, '..', '..'))
const date = new Date().toJSON().slice(0, 10)
const errorStreamerRotatedByLength = {
    type: 'raw',
    level: 'error',
    stream: new RotatingFileStream({
        path: `${projectBaseDir}/logs/log-${date}.errors.log`,
        ...logSettings,
    }),
}

const infoStreamerRotatedByLength = {
    type: 'raw',
    level: 'info',
    stream: new RotatingFileStream({
        path: `${projectBaseDir}/logs/log-${date}.log`,
        ...logSettings,
    }),
}

const mainLoggerStreams: RotatingFileStream[] = [
    infoStreamerRotatedByLength,
    errorStreamerRotatedByLength,
]

export const stream = bunyan.createLogger({
    name: String(process.env.APP_NAME),
    serializers: {
        req: require('bunyan-express-serializer'),
        res: bunyan.stdSerializers.res,
        err: bunyan.stdSerializers.err,
    },
    streams: mainLoggerStreams,
})

export function logger(id: any, body: any, statusCode: any) {
    const log = stream.child(
        {
            id,
            body,
            statusCode,
        },
        true
    )

    if (statusCode > 404) {
        return log.error(body)
    }

    return log.info(body)
}
