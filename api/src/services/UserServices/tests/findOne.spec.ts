import * as chai from 'chai'
import * as faker from 'faker'

import { create } from '../create'
import { findOne } from '../findOne'
import { promisify } from '../../../utils'

const expect = chai.expect

describe('=> Find one user service <=', () => {
    it('=> should return 404 if user does not exist.', async () => {
        const [user, userErr] = await promisify(
            findOne('email', 'email123-that-doesnt-exist@gmail.com')
        )

        expect(user).to.equal(undefined)
        expect(userErr!.code).to.equal(404)
        expect(userErr!.message.toString()).to.equal('User not found')
    })
    it('=> should find a user by the given key value pair', async () => {
        const userObj = {
            userName: faker.internet.userName(),
            email: 'email@email.com',
            password: 'My_passwd@12',
        }
        const [userId] = await promisify(create(userObj))

        const [foundUser, foundUserErr] = await promisify(
            findOne('id', userId!)
        )
        expect(foundUserErr).to.equal(undefined)
        expect(foundUser).to.haveOwnProperty('email')
        expect(foundUser).to.not.haveOwnProperty('password')

        const [foundUser2, foundUser2Err] = await promisify(
            findOne('email', userObj.email)
        )
        expect(foundUser2Err).to.equal(undefined)
        expect(foundUser2).to.haveOwnProperty('email')
        expect(foundUser2).to.not.haveOwnProperty('password')
    })
})
