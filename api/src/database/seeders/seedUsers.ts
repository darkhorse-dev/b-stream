import userFactory from '../factories/userFactory'
import { UserServices } from '../../services/UserServices'
import { promisify } from '../../utils'

export default async function seedUsers(amount: number = 10): Promise<any> {
    const users = userFactory(amount)

    console.log('=> Seeding users table')

    const userList = users.map(async user => {
        const [newUser, newUserErr] = await promisify(UserServices.create(user))
        if (newUserErr) {
            return null
        }

        return newUser
    })

    return Promise.resolve(Promise.all([...userList]))
}
