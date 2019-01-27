import {
    PrimaryColumn,
    UpdateDateColumn,
    CreateDateColumn,
    BeforeInsert,
    AfterLoad,
} from 'typeorm'

import { formattedUUID } from '../../utils'

export abstract class Model {
    @PrimaryColumn('uuid')
    public id: string | undefined

    @CreateDateColumn({ nullable: false })
    public createdAt: string | undefined

    @UpdateDateColumn({ nullable: false })
    public updatedAt: string | undefined

    @BeforeInsert()
    beforeInsert() {
        this.id = formattedUUID()
    }

    @AfterLoad()
    handleAfterLoad() {
        this.createdAt = String(this.createdAt)
        this.updatedAt = String(this.updatedAt)
    }
}
