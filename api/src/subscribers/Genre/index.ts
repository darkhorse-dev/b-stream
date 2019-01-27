import { EventSubscriber, EntitySubscriberInterface } from 'typeorm'

import { Genre } from '../../entities'

@EventSubscriber()
export class GenreSubscriber implements EntitySubscriberInterface<Genre> {
    //
}
