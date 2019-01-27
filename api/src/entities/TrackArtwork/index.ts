import { Entity, ManyToOne } from 'typeorm'

import { Artwork } from '../Artwork'
import { Track } from '../Track'

@Entity('trackArtwork')
export class TrackArtwork extends Artwork {
    @ManyToOne(() => Track, track => track.id)
    public track: Track | undefined
}
