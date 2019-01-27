import { access, createReadStream, constants } from 'fs'
import { normalize, resolve } from 'path'
import { Router, Response } from 'express'

import * as httpMessages from '../../utils/httpMessages'
import { validationFunc, validationRules } from './validation'
import { pick, promisify, escapeString } from '../../utils'
import TrackSchema from '../../schemas/TrackSchema'
import { TrackServices } from '../../services/TrackServices'
import { logger } from '../../utils/logging'
import { allowedTrackFileExt } from '../../entities/Track'
import { ExtendedRequest } from '../../interfaces/ExtendedRequest'
import { requireLogin } from '../../middleware'

const baseDir = normalize(resolve(__dirname, '..', '..', '..'))
const storageDir = `${baseDir}/storage`
const fieldsToRemove = ['fileName', 'fileSize', 'fileExt']

class TrackController {
    public router: Router

    constructor() {
        this.router = Router()
        this.routes()
    }

    public routes() {
        this.router.get('/', this.getTracks)
        this.router.get(
            '/user/:id',
            [...validationRules.getUserTracks],
            validationFunc,
            this.getUserTracks
        )
        this.router.get(
            '/stream/:id',
            [...validationRules.streamTrack],
            validationFunc,
            this.streamTrack
        )
        this.router.get(
            '/:id',
            [...validationRules.getTrack],
            validationFunc,
            this.getTrack
        )
        this.router.post(
            '/',
            [...validationRules.uploadTrack],
            validationFunc,
            requireLogin,
            this.uploadTrack
        )
    }

    private getUserTracks = async (
        req: ExtendedRequest,
        res: Response
    ): Promise<any> => {
        const userId = escapeString(req.params.id)
        const [tracks, tracksErr] = await promisify(
            TrackServices.findAll(
                { userId, relations: ['user'] },
                true,
                fieldsToRemove
            )
        )
        if (tracksErr) {
            logger(req.ip, tracksErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        return res.status(200).json(httpMessages.code200(tracks))
    }

    private getTracks = async (
        req: ExtendedRequest,
        res: Response
    ): Promise<any> => {
        const [tracks, tracksErr] = await promisify(
            TrackServices.findAll({}, true, fieldsToRemove)
        )
        if (tracksErr) {
            logger(req.ip, tracksErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        return res.status(200).json(httpMessages.code200(tracks))
    }

    private getTrack = async (
        req: ExtendedRequest,
        res: Response
    ): Promise<any> => {
        const trackId = escapeString(req.params.id)
        const [foundTrack, foundTrackErr] = await promisify(
            TrackServices.findOne('id', trackId, true, fieldsToRemove)
        )
        if (foundTrackErr) {
            if (foundTrackErr.code === 404) {
                logger(req.ip, foundTrackErr, 404)

                return res.status(404).json(httpMessages.code404())
            }

            logger(req.ip, foundTrackErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        return res.status(200).json(httpMessages.code200(foundTrack))
    }

    private streamTrack = async (
        req: ExtendedRequest,
        res: Response
    ): Promise<any> => {
        const trackId = escapeString(req.params.id)
        const [foundTrack, foundTrackErr] = await promisify(
            TrackServices.findOne('id', trackId)
        )
        if (foundTrackErr) {
            if (foundTrackErr.code === 404) {
                logger(req.ip, foundTrackErr, 404)

                return res.status(404).json(httpMessages.code404())
            }

            logger(req.ip, foundTrackErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        const { name, fileName, fileSize, fileExt } = foundTrack
        const trackFile = `${storageDir}/${fileName}.${fileExt}`
        access(trackFile, constants.F_OK, err => {
            if (err) {
                res.writeHead(404, 'Not Found')

                return res.end()
            }

            res.writeHead(200, {
                'Content-Type': `audio/${fileExt}`,
                'Content-Disposition': `attachment; filename="${name}.${fileExt}"`,
                'Content-Length': fileSize,
            })
            const stream = createReadStream(trackFile)
            stream.on('error', error => {
                logger(`${fileName}.${fileExt} stream error`, error, 404)
                res.writeHead(404, 'Not Found')

                return res.end()
            })

            stream.on('end', () => {
                return res.end()
            })

            stream.pipe(res)
        })
    }

    private uploadTrack = async (req: any, res: Response): Promise<any> => {
        if (!req.files) {
            return res.status(406).json({
                status: 406,
                error: 'No file provided',
                message: 'A file must be provided for this endpoint',
            })
        }

        const filteredData = pick(req.body, TrackSchema)
        const textFields = { user: req.user.id }
        for (const key in filteredData) {
            if (filteredData.hasOwnProperty(key)) {
                textFields[key] = escapeString(filteredData[key])
            }
        }

        const tempTrackData = req.files.file
        const mimeTypeMatches = allowedTrackFileExt.filter(s =>
            `audio/${tempTrackData.mimetype}`.includes(s)
        )
        if (!tempTrackData.mimetype || mimeTypeMatches.length === 0) {
            return res.status(406).json({
                status: 406,
                error: 'Unsupported file type',
                message: `The file type ${
                    tempTrackData.mimetype
                } is not supported`,
            })
        }

        const [tempTrack, tempTrackErr] = await promisify(
            TrackServices.createTempTrack(tempTrackData)
        )
        if (tempTrackErr) {
            logger(req.ip, tempTrackErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        const [, permTrackErr] = await promisify(
            TrackServices.createPermTrack(tempTrack)
        )
        if (permTrackErr) {
            logger(req.ip, permTrackErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        const trackData = {
            ...textFields,
            ...tempTrack,
        }

        const [newTrackId, newTrackIdErr] = await promisify(
            TrackServices.create(trackData)
        )
        if (newTrackIdErr) {
            logger(req.ip, newTrackIdErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        const [foundTrack, foundTrackErr] = await promisify(
            TrackServices.findOne('id', newTrackId, true, fieldsToRemove)
        )
        if (foundTrackErr) {
            logger(req.ip, foundTrackErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        return res.status(201).json(httpMessages.code201(foundTrack))
    }
}

export default new TrackController().router
