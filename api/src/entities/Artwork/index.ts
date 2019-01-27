import { Column, BeforeInsert, BeforeUpdate } from 'typeorm'

import { Model } from '../Model'
import { validateData } from '../helpers'

export abstract class Artwork extends Model {
    @Column({ type: 'text', nullable: false })
    public imageUrl: string | undefined

    @Column({ type: 'int', width: 11, nullable: false })
    public width: string | undefined

    @Column({ type: 'int', width: 11, nullable: false })
    public height: string | undefined

    @BeforeInsert()
    @BeforeUpdate()
    async handleBeforeInsert() {
        await validateData<Artwork>(this)
    }
}
