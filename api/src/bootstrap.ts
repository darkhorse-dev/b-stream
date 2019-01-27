import 'dotenv-safe/config'
import 'reflect-metadata'
import { normalize, resolve } from 'path'
import { mkdir } from 'shelljs'
import { createServer } from 'http'

import Database from './Database'
import { logger } from './utils/logging'

const projectDirBasePath = normalize(resolve(__dirname, '..'))
const port = Number(process.env.PORT) || 8080

let httpServer = createServer()
async function main() {
    const dirs = [
        `${projectDirBasePath}/storage`,
        `${projectDirBasePath}/temp`,
        `${projectDirBasePath}/logs`,
    ]
    mkdir('-p', dirs)

    await Database.init()

    setTimeout(() => {
        const server = require('./Server').default
        server.set('port', port)
        httpServer = createServer(server)
        httpServer.listen(port)
        httpServer.on('error', onError)
        console.info(
            `\n=> ${process.env.APP_NAME} is ready for use on port ${port} <=`
        )
    })
}

function onError(error: NodeJS.ErrnoException): void {
    console.error('Error in Index: ', error)

    if (error.syscall !== 'listen') {
        throw error
    }
    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`)
            closeDBConnection()
            closeServer()
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`)
            closeDBConnection()
            closeServer()
            process.exit(1)
            break
        default:
            throw error
    }
}

function closeDBConnection() {
    Database.closeConnection().then(() => console.log('DB connection closed.'))
}

function closeServer() {
    httpServer.close()
}

process.on(
    'uncaughtException',
    (exception: NodeJS.ErrnoException): void => {
        logger('uncaughtException in index', exception, 500)
        console.error('uncaughtException: ', exception)
        closeDBConnection()
        closeServer()

        process.exit(1)
    }
)

process.on(
    'unhandledRejection',
    (reason: any, promise: any): void => {
        logger('unhandledRejection in index', { reason, promise }, 500)
        console.error('unhandledRejection: ', promise, ' reason: ', reason)
        closeDBConnection()
        closeServer()

        process.exit(1)
    }
)

// Clean up on nodemon restarts
process.once('SIGUSR2', () => {
    closeDBConnection()
    process.kill(process.pid, 'SIGUSR2')
})

process.on('SIGINT', () => {
    closeDBConnection()
    closeServer()
    process.exit(0)
})

process.on('SIGTERM', () => {
    closeDBConnection()
    closeServer()
    process.exit(0)
})

export default main
