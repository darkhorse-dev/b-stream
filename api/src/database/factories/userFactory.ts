import * as faker from 'faker'

const userShape = () => ({
    id: faker.random.uuid(),
    userName: faker.internet.userName(),
    email: faker.internet.email(),
    password: 'Pass_wd@!123',
})

export default (amount = 10) => {
    const users: any[] = []
    for (let i = 0; i < amount; i += 1) {
        users.push({ ...userShape() })
    }

    console.log(`=> Created ${amount} users`)

    return users
}
