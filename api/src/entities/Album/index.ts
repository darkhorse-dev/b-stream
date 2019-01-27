import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm'
import { Length, IsOptional } from 'class-validator'

import { Model } from '../Model'
import { validateData } from '../helpers'

@Entity('album')
export class Album extends Model {
    @Column({ type: 'varchar', length: 255, nullable: false })
    @Length(3, 255)
    public name: string | undefined

    @Column({ type: 'text', nullable: true })
    public description: string | undefined

    @Column({ type: 'tinyint', width: 1, nullable: false, default: 1 })
    public isDownloadable: boolean | undefined

    @Column({ type: 'int', width: 11, nullable: false, default: 0 })
    public timesPlayed: number | undefined

    @Column({ type: 'int', width: 11, nullable: false, default: 0 })
    public trackNumber: number | undefined

    @Column({ type: 'text', nullable: true })
    @IsOptional()
    public tags: string | undefined

    /*@ManyToMany(() => Track, track => track.album)
    @JoinTable({ name: 'albumTrack' })
    public tracks: Track[] | undefined*/
    @BeforeInsert()
    @BeforeUpdate()
    async handleBeforeInsert() {
        await validateData<Album>(this)
    }
}
