import * as chai from 'chai'
import * as chaiPromises from 'chai-as-promised'
import * as request from 'supertest'

import bootstrap from '../bootstrap'
import Database from '../Database'

chai.use(chaiPromises)

before(async () => {
    await bootstrap()
    if (!Database.isConnected) {
        await Database.openConnection()
    }

    await Database.clearTables()
})

beforeEach(async () => {
    await Database.clearTables()
})

after(async () => {
    await Database.clearTables()
    await Database.closeConnection()
    console.log('=> Connections closed')
})

export const r = request('http://localhost:8080')
export const expect = chai.expect
