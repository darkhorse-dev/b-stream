import { Entity, Column, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm'
import {
    IsEmail,
    IsFQDN,
    IsLowercase,
    Length,
    IsOptional,
} from 'class-validator'

import { Model } from '../Model'
import { Track } from '../Track'
import { hashPassword } from '../../auth/password'
import { promisify } from '../../utils'
import { validateData } from '../helpers'

export const passwordRegex = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,30}$/,
    'i'
)
export const passwordValidationMessage =
    'A valid password consists of atleast 1 uppercase letter, 1 special character, 1 number, and is between 8 - 30 characters long.'

@Entity('user')
export class User extends Model {
    @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
    @IsLowercase()
    @Length(3, 255)
    public userName: string | undefined

    @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
    @IsEmail()
    @IsLowercase()
    @Length(5, 255)
    public email: string | undefined

    @Column({ type: 'varchar', length: 255, nullable: false })
    @Length(8, 30)
    public password: string | undefined

    @Column({ type: 'varchar', length: 255, nullable: true })
    @IsOptional()
    @IsFQDN()
    public website: string | undefined

    @Column({ type: 'varchar', length: 255, nullable: true })
    @IsOptional()
    public websiteTitle: string | undefined

    @Column({ type: 'tinyint', width: 1, nullable: false, default: 0 })
    @IsOptional()
    public isConfirmed: boolean | undefined

    @OneToMany(() => Track, track => track.user)
    public tracks: Track[] | undefined

    @BeforeInsert()
    async handleBeforeInsert() {
        if (this.userName) {
            this.userName = this.userName.replace(/\s+/g, '-').toLowerCase()
        }
        if (this.email) {
            this.email = this.email.toLowerCase()
        }
        if (
            this.password &&
            this.password !== String(process.env.DEFAULT_OAUTH_PASSWORD)
        ) {
            if (validatePassword(this.password)) {
                const [hashedPassword, hashedPasswordErr] = await promisify(
                    hashPassword(this.password)
                )
                if (hashedPasswordErr) {
                    throw new Error('In password hash.')
                }

                await validateData<User>(this)

                this.password = hashedPassword

                return
            } else {
                throw new TypeError(passwordValidationMessage)
            }
        }

        await validateData<User>(this)
    }

    @BeforeUpdate()
    async handleBeforeUpdate() {
        if (this.userName) {
            this.userName = this.userName.replace(/\s+/g, '-').toLowerCase()
        }
        if (this.email) {
            this.email = this.email.toLowerCase()
        }
        if (this.password) {
            // Skip password hashing as its most likely already hashed
            if (this.password.startsWith('$argon2id')) {
                const currentData: Partial<User> = {}
                Object.assign(currentData, this)
                delete currentData.password
                await validateData<User>(currentData)

                return
            }

            if (validatePassword(this.password)) {
                const [hashedPassword, hashedPasswordErr] = await promisify(
                    hashPassword(this.password)
                )
                if (hashedPasswordErr) {
                    throw new Error('In password hash.')
                }

                await validateData<User>(this)

                this.password = hashedPassword

                return
            } else {
                throw new TypeError(passwordValidationMessage)
            }
        }

        await validateData<User>(this)
    }
}

function validatePassword(password: string) {
    return passwordRegex.test(password)
}
