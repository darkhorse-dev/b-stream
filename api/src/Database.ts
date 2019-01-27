import { readdirSync, unlinkSync, writeFileSync } from 'fs'
import { normalize, resolve, join } from 'path'
import {
    createConnection,
    ConnectionOptions,
    Connection,
    getManager,
} from 'typeorm'

import { logger } from './utils/logging'

const isProduction = process.env.NODE_ENV === 'production'
const isTesting = process.env.NODE_ENV === 'test'
const database = isTesting
    ? String(process.env.MYSQL_DATABASE_TEST)
    : String(process.env.MYSQL_DATABASE)
const projectDirBasePath = normalize(resolve(__dirname, '..'))

class Database {
    connectionOptions: ConnectionOptions
    connection: Connection

    constructor() {
        this.connectionOptions = {
            database,
            type: 'mysql',
            maxQueryExecutionTime: 800,
            entities: ['src/entities/**/index.ts'],
            subscribers: ['src/subscribers/**/index.ts'],
            migrations: ['src/migrations/*.ts'],
            host: String(process.env.MYSQL_HOST),
            port: Number(process.env.MYSQL_PORT),
            username: String(process.env.MYSQL_ROOT_USER),
            password: String(process.env.MYSQL_PASSWORD),
            logging: !isProduction && !isTesting,
            synchronize: true,
        }
        this.connection = new Connection(this.connectionOptions)
    }

    public async init() {
        await this.openConnection()
        await this.genModelSchemas()

        console.info('=> DB successfully connected')
    }

    public get isConnected() {
        return this.connection.isConnected
    }

    public async openConnection() {
        try {
            this.connection = await createConnection(this.connectionOptions)

            await this.connection.close()
            await this.connection.connect()
        } catch (err) {
            logger('Error in db connection', err, 500)
            console.error('Error in db connection: ', err)

            process.exit(1)
        }
    }

    public async closeConnection() {
        try {
            await this.connection.close()
        } catch (err) {
            logger('Error in db connection close', err, 500)
            console.error('Error in db connection close: ', err)

            process.exit(1)
        }
    }

    public async clearTables() {
        const entities = this.connection.entityMetadatas
        const manager = getManager()

        await manager.query('SET FOREIGN_KEY_CHECKS=0;')

        for (const entity of entities) {
            const repository = await this.connection.getRepository(entity.name)
            const query = `TRUNCATE TABLE \`${entity.tableName}\`;`
            try {
                await repository.query(query)
            } catch (err) {
                // console.log(err)
            }
        }

        await manager.query('SET FOREIGN_KEY_CHECKS=1;')
    }

    /**
     * Loop through all models and gen schemas
     * to validate against later
     */
    private async genModelSchemas() {
        const schemasDir = `${projectDirBasePath}/src/schemas`
        try {
            // Clear dir of old files
            const files = readdirSync(schemasDir)
            for (const file of files) {
                const filePath = normalize(join(schemasDir, file))
                unlinkSync(filePath)
            }

            // Gen new files
            const entities = this.connection.entityMetadatas
            for (const entity of entities) {
                const modelSchema = this.connection.getMetadata(entity.name)
                    .propertiesMap

                const objKeys = Object.keys(modelSchema)
                const keys = objKeys.map((k: string) => `\n    '${k}'`)
                const template = `export default [${keys},\n]\n`

                const fileName =
                    entity.name.charAt(0).toUpperCase() + entity.name.slice(1)
                const schemaFile = `${schemasDir}/${fileName}Schema.ts`
                try {
                    writeFileSync(schemaFile, template)
                } catch (err) {
                    console.error(err)

                    process.exit(0)
                }
            }

            console.info('=> Entity schemas created!')
        } catch (err) {
            console.error(err)

            process.exit(0)
        }
    }
}

export default new Database()
