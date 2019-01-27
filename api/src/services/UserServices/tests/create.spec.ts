import * as chai from 'chai'
import * as faker from 'faker'

import { create } from '../create'
import { promisify } from '../../../utils'

const expect = chai.expect

describe('=> Create user service <=', () => {
    it('=> should handle case when user already exists and reject it', async () => {
        const user = {
            userName: `${faker.internet.userName()}nda9`,
            email: 'anEmail@emailc.om',
            password: 'My_passwd@!12',
        }

        await promisify(create(user))

        const [, dupUserErr] = await promisify(create(user))
        const duplicateErrorCode = 'Duplicate entry'
        expect(dupUserErr!.code).to.equal(409)
        expect(dupUserErr!.message.startsWith(duplicateErrorCode)).to.equal(
            true
        )
    })
})
