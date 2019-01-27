import { Entity, Column, ManyToOne, BeforeInsert, BeforeUpdate } from 'typeorm'
import { Length, IsOptional } from 'class-validator'

import { Model } from '../Model'
import { User } from '../User'
import { validateData } from '../helpers'

export const allowedTrackFileExt = ['mp4', 'mp3']

@Entity('track')
export class Track extends Model {
    @Column({ type: 'varchar', length: 255, nullable: false })
    @Length(3, 255)
    public name: string | undefined

    @Column({ type: 'text', nullable: true })
    public description: string | undefined

    @Column({ type: 'varchar', length: 255, nullable: false })
    public fileName: string | undefined

    @Column({ type: 'int', width: 11, nullable: false })
    public fileSize: number | undefined

    @Column({ type: 'enum', enum: allowedTrackFileExt, nullable: false })
    public fileExt: string | undefined

    /*
    @Column({ type: 'int', width: 11, nullable: false })
    public duration: number | undefined
    */

    @Column({ type: 'int', width: 11, nullable: false, default: 0 })
    public timesPlayed: number | undefined

    @Column({ type: 'int', width: 11, nullable: false, default: 0 })
    public trackNumber: number | undefined

    @Column({ type: 'tinyint', width: 1, nullable: false, default: 1 })
    public isDownloadable: boolean | undefined

    @Column({ type: 'tinyint', width: 1, nullable: false, default: 0 })
    public isExplicit: boolean | undefined

    @Column({ type: 'text', nullable: true })
    @IsOptional()
    public tags: string | undefined

    /*@OneToMany(() => TrackArtwork, trackArtwork => trackArtwork.track)
    public trackArtwork: TrackArtwork[] | undefined

    @ManyToOne(() => Album, album => album.id)
    public album: Album | undefined

    @ManyToMany(() => Artist, artist => artist.id)
    public artist: Artist | undefined

    @ManyToMany(() => Genre, genre => genre.id)
    @JoinTable({ name: 'trackGenre' })
    public genres: Genre[] | undefined*/

    @ManyToOne(() => User, user => user.id)
    public user: User | undefined

    @BeforeInsert()
    @BeforeUpdate()
    async handleBeforeInsert() {
        await validateData<Track>(this)
    }
}
