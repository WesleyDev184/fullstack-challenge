import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateNotificationDto } from '@repo/types'
import { Notification } from '@shared/database/entities/notification.entity'
import { EntityManager, Repository } from 'typeorm'
import { NotificationGateway } from './notification.gateway'

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly entityManager: EntityManager,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async createNotification(createNotificationDto: CreateNotificationDto) {
    const notification = this.notificationRepository.create({
      recipientId: createNotificationDto.recipientId,
      title: createNotificationDto.title,
      content: createNotificationDto.content,
      category: createNotificationDto.category,
    })
    await this.entityManager.save(notification)

    this.notificationGateway.server.emit('notification', notification)
  }
}
