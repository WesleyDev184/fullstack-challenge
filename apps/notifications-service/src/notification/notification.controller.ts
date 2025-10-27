import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CreateNotificationDto } from '@repo/types'
import { NotificationService } from './notification.service'

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern('create.notification')
  createNotification(@Payload() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.createNotification(createNotificationDto)
  }
}
