import { Notification } from '@/shared/database/entities/notification.entity'
import { Inject } from '@nestjs/common'
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm'
import { NotificationGateway } from './notification.gateway'

@EventSubscriber()
export class NotificationSubscriber
  implements EntitySubscriberInterface<Notification>
{
  constructor(
    @Inject(DataSource) dataSource: DataSource,
    private readonly notificationGateway: NotificationGateway,
  ) {
    dataSource.subscribers.push(this)
  }

  listenTo() {
    return Notification
  }

  afterInsert(event: InsertEvent<Notification>) {
    console.log(`AFTER NOTIFICATION INSERTED: `, event.entity)
    const data = event.entity
    data.assigneeIds.forEach(assigneeId => {
      const { assigneeIds, ...rest } = data
      this.notificationGateway.server.emit(`notification.${assigneeId}`, rest)
    })
  }
}
