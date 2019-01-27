import * as argon2 from 'argon2'

import { promisify } from '../utils'

export async function hashPassword(password: string): Promise<string | null> {
    const options = {
        timeCost: 4,
        memoryCost: 2 ** 13,
        parallelism: 2,
        type: argon2.argon2id,
    }

    const [hash, hashErr] = await promisify(argon2.hash(password, options))

    if (hashErr) {
        throw new Error(hashErr.message)
    }

    return hash ? String(hash) : null
}

export async function verifyPassword(
    hash: string,
    password: string
): Promise<boolean> {
    const [verified, verifiedErr] = await promisify(
        argon2.verify(hash, password)
    )

    if (verifiedErr) {
        return false
    }

    return verified ? !!verified : false
}
