import { EventSubscriber, EntitySubscriberInterface } from 'typeorm'

import { Track } from '../../entities'

@EventSubscriber()
export class TrackSubscriber implements EntitySubscriberInterface<Track> {
    //
}
