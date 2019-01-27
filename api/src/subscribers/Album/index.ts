import { EventSubscriber, EntitySubscriberInterface } from 'typeorm'

import { Album } from '../../entities'

@EventSubscriber()
export class AlbumSubscriber implements EntitySubscriberInterface<Album> {
    //
}
