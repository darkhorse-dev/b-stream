import * as faker from 'faker'

import { r, expect } from '../setup'
import { UserServices } from '../../services/UserServices'
import { promisify } from '../../utils'
import { deleteSession } from '../utils'

const genUserData = () => ({
    userName: `${faker.internet.userName()}w`,
    email: 'myEmail@gmail.com',
    password: 'My_passwd@!12',
})

describe('=> API Login Endpoint <=', () => {
    let userObj: any
    beforeEach(async () => {
        userObj = genUserData()
        await promisify(UserServices.create(userObj))
    })
    it('=> basicLogin should return user obj along with and cookie header after login', async () => {
        const { email, password } = userObj
        const response = await r
            .post('/v1/login')
            .set('Content-Type', 'application/json')
            .send({ email, password })

        const cookie = response.header['set-cookie']

        await deleteSession(r, cookie)

        expect(response.body.response).to.haveOwnProperty('id')
        expect(response.body.response).to.haveOwnProperty('email')
        expect(response.body.response).to.not.haveOwnProperty('password')
        expect(cookie.length).to.equal(1)
        expect(response.status).to.equal(200)
    })
    it('=> basicLogin should return 401 for invalid credentials & 404 for user not found', async () => {
        const { email, password } = userObj
        const response = await r
            .post('/v1/login')
            .set('Content-Type', 'application/json')
            .send({ password, email: `dsani${email}` })

        expect(response.status).to.equal(404)
    })
    it('=> basicLogin should return 401 for invalid credentials', async () => {
        const { email } = userObj

        const response = await r
            .post('/v1/login')
            .set('Content-Type', 'application/json')
            .send({ email, password: 's' })

        expect(response.status).to.equal(401)
    })
})
