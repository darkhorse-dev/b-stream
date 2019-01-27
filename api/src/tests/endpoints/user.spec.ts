import * as faker from 'faker'

import { r, expect } from '../setup'
import { UserServices } from '../../services/UserServices'
import { promisify } from '../../utils'
import { createSession, deleteSession } from '../utils'

const genUserData = () => ({
    userName: `${faker.internet.userName()}w`,
    email: 'myEmail@email.com',
    password: 'My_Passwd@!123',
})
const baseUrl = '/v1/users'

describe('=> API User Endpoint <=', () => {
    describe('=> createUser <=', () => {
        it('=> should return a new user if valid data is passed', async () => {
            const newUserObj = genUserData()

            const response = await r
                .post(baseUrl)
                .set('Content-Type', 'application/json')
                .send(newUserObj)
            const cookie = response.header['set-cookie']

            await deleteSession(r, cookie)
            expect(response.body.response).to.haveOwnProperty('id')
            expect(response.body.response).to.haveOwnProperty('email')
            expect(response.body.response).to.not.haveOwnProperty('password')
            expect(cookie.length).to.equal(1)
            expect(response.status).to.equal(201)
        })
        it('=> should return an error if data is bad', async () => {
            const newUserObj = genUserData()
            newUserObj.password = 'passwd'

            const response = await r
                .post(baseUrl)
                .set('Content-Type', 'application/json')
                .send(newUserObj)

            expect(response.status).to.equal(422)
        })
        it('=> should return an error if required data is missing or doesnt pass validation', async () => {
            const userObj = genUserData()
            // Check password requirements validation
            const response = await r
                .post(baseUrl)
                .set('Content-Type', 'application/json')
                .send({ ...userObj, password: 'password' })

            expect(response.status).to.equal(422)

            delete userObj.userName
            const response2 = await r
                .post(baseUrl)
                .set('Content-Type', 'application/json')
                .send(userObj)

            expect(response2.status).to.equal(422)
        })
    })
    describe('=> getUser <=', () => {
        let userObj: any
        let userId: any
        beforeEach(async () => {
            userObj = genUserData()
            const response = await r
                .post(baseUrl)
                .set('Content-Type', 'application/json')
                .send(userObj)

            const cookie = response.header['set-cookie']
            await deleteSession(r, cookie)

            userId = response.body.response.id
        })
        it('=> should return a user found by ID', async () => {
            const response = await r
                .get(`${baseUrl}/${userId}`)
                .set('Content-Type', 'application/json')

            expect(response.body.response).to.haveOwnProperty('id')
            expect(response.body.response).to.haveOwnProperty('email')
            expect(response.body.response).to.not.haveOwnProperty('password')
            expect(response.status).to.equal(200)
        })
        it('=> should return 404 if not found', async () => {
            const response = await r
                .get(`${baseUrl}/some-id-that-doesnt-exist`)
                .set('Content-Type', 'application/json')

            expect(response.status).to.equal(404)
        })
    })
    describe('=> getUsers <=', () => {
        let userObj: any
        beforeEach(async () => {
            userObj = genUserData()
        })
        it('=> should return an empty array if there are no users', async () => {
            const response = await r
                .get(baseUrl)
                .set('Content-Type', 'application/json')

            expect(response.body.response).to.eql([])
        })
        it('=> should return an array of users', async () => {
            const user1 = await r
                .post(baseUrl)
                .set('Content-Type', 'application/json')
                .send(userObj)

            const newUserObj = {
                ...userObj,
                userName: `${userObj.userName}2n`,
                email: `sda90${userObj.email}`,
            }

            const user2 = await r
                .post(baseUrl)
                .set('Content-Type', 'application/json')
                .send(newUserObj)

            await deleteSession(r, user1.header['set-cookie'][0])
            await deleteSession(r, user2.header['set-cookie'][0])

            const response = await r
                .get(baseUrl)
                .set('Content-Type', 'application/json')

            expect(response.body.response[0]).to.haveOwnProperty('id')
            expect(response.body.response[0]).to.haveOwnProperty('email')
            expect(response.body.response[0]).to.not.haveOwnProperty('password')
            expect(response.body.response.length).to.equal(2)
            expect(response.status).to.equal(200)
        })
    })
    describe('=> updateUser <=', () => {
        it('=> should update the user found by the given id with new data from body', async () => {
            const userObj = genUserData()
            const [userId] = await promisify(UserServices.create(userObj))

            const cookie = await createSession(r, {
                email: userObj.email,
                password: userObj.password,
            })
            const originalUserObj = { ...userObj }

            const newEmail = 'myemail@gmail.com'
            const newUserName = 'my-new-user-name'

            userObj.email = newEmail
            userObj.userName = newUserName

            const response2 = await r
                .patch(`${baseUrl}/${userId}`)
                .set('Content-Type', 'application/json')
                .set('cookie', cookie)
                .send(userObj)

            await deleteSession(r, cookie)

            expect(response2.body.response).to.haveOwnProperty('id')
            expect(response2.body.response).to.haveOwnProperty('email')
            expect(response2.body.response).to.not.haveOwnProperty('password')
            expect(response2.body.response.email).to.equal(newEmail)
            expect(response2.body.response.email).to.not.equal(
                originalUserObj.email
            )
            expect(response2.body.response.userName).to.equal(newUserName)
            expect(response2.body.response.userName).to.not.equal(
                originalUserObj.userName
            )
            expect(response2.status).to.equal(200)
        })
    })
    describe('=> deleteUser <=', () => {
        it('=> should delete user found by the given id', async () => {
            const userObj = genUserData()
            const [userId] = await promisify(UserServices.create(userObj))
            const cookie = await createSession(r, {
                email: userObj.email,
                password: userObj.password,
            })

            const res = await r
                .delete(`${baseUrl}/${userId}`)
                .set('Content-Type', 'application/json')
                .set('cookie', cookie)
            console.log(res.body)

            const response2 = await r
                .get(`${baseUrl}/${userId}`)
                .set('Content-Type', 'application/json')

            expect(response2.status).to.equal(404)
        })
    })
})
