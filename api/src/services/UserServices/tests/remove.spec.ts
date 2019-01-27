import * as chai from 'chai'
import * as faker from 'faker'

import { create } from '../create'
import { findOne } from '../findOne'
import { remove } from '../remove'
import { promisify } from '../../../utils'

const expect = chai.expect

describe('=> Remove user service <=', () => {
    it('=> should remove a user by the given user obj', async () => {
        const [userId, userIdErr] = await promisify(
            create({
                userName: faker.internet.userName(),
                email: 'email@email.com',
                password: 'My_passwd@12',
            })
        )
        expect(userIdErr).to.equal(undefined)

        const [removeUser, removeUserErr] = await promisify(remove(userId))
        expect(removeUserErr).to.equal(undefined)
        expect(removeUser).to.equal(null)

        const [userToBeDeleted, userToBeDeletedErr] = await promisify(
            findOne('id', userId)
        )
        expect(userToBeDeleted).to.equal(undefined)
        expect(userToBeDeletedErr!.code).to.equal(404)
        expect(userToBeDeletedErr!.message.toString()).to.equal(
            'User not found'
        )
    })
})
