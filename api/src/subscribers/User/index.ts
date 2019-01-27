import { EventSubscriber, EntitySubscriberInterface } from 'typeorm'

import { User } from '../../entities'

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    //
}
