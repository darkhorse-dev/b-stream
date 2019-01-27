import { EventSubscriber, EntitySubscriberInterface } from 'typeorm'

import { Artist } from '../../entities'

@EventSubscriber()
export class ArtistSubscriber implements EntitySubscriberInterface<Artist> {
    //
}
