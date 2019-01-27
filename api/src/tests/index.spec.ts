import { r, expect } from './setup'

describe('=> API base route <=', () => {
    it('=> should serve /v1 without crashing', async () => {
        const response = await r
            .get('/v1')
            .set('Content-Type', 'application/json')

        expect(response.status).to.equal(404)
    })
})
