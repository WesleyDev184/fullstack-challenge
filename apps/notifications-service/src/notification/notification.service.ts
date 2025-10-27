import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateNotificationDto } from '@repo/types'
import { Notification } from '@shared/database/entities/notification.entity'
import { EntityManager, Repository } from 'typeorm'

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly entityManager: EntityManager,
  ) {}

  async createNotification(createNotificationDto: CreateNotificationDto) {
    const notification = this.notificationRepository.create({
      assigneeIds: createNotificationDto.assigneeIds,
      taskId: createNotificationDto.taskId,
      title: createNotificationDto.title,
      content: createNotificationDto.content,
      category: createNotificationDto.category,
    })
    await this.entityManager.save(notification)
  }
}
