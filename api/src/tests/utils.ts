import { SuperAgent } from 'superagent'

interface Login {
    email: string
    password: string
}

export async function createSession(r: SuperAgent<any>, data: Login) {
    const response = await r
        .post('/v1/login')
        .set('Content-Type', 'application/json')
        .send(data)

    return response.header['set-cookie'][0]
}

export async function deleteSession(r: SuperAgent<any>, cookie: string) {
    await r
        .post('/v1/logout')
        .set('Content-Type', 'application/json')
        .set('cookie', cookie)
        .send({})
}
