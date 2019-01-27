import { Entity, ManyToOne } from 'typeorm'

import { Artwork } from '../Artwork'
import { Album } from '../Album'

@Entity('albumArtwork')
export class AlbumArtwork extends Artwork {
    @ManyToOne(() => Album, album => album.id)
    public album: Album | undefined
}
