import * as chai from 'chai'
import * as faker from 'faker'

import { create } from '../create'
import { findAll } from '../findAll'
import { promisify } from '../../../utils'

const expect = chai.expect

describe('=> Find all user service <=', () => {
    it('=> should return empty array if no users.', async () => {
        const [users, usersErr] = await promisify(findAll())

        expect(usersErr).to.equal(undefined)
        expect(users).to.eql([])
    })
    it('=> should return an array of user objects.', async () => {
        const AMOUNT_OF_USERS = 2
        for (let i = 0; i < AMOUNT_OF_USERS; i += 1) {
            await create({
                userName: `${faker.internet.userName()}dsnad90`,
                email: `coolnewEmail2${i}@gmail.com`,
                password: 'My_pasdsaswd@12',
            })
        }

        const [users, usersErr] = await promisify(findAll())

        expect(usersErr).to.equal(undefined)
        expect(users).to.have.lengthOf(AMOUNT_OF_USERS)
        expect(users![0]).to.haveOwnProperty('email')
        expect(users![0]).to.not.haveOwnProperty('password')
    })
})
