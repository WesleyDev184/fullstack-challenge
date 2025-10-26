import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { NotificationService } from './notification.service'

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern('task.created')
  create(@Payload() createNotificationDto: any) {
    console.log('Received task.created message:', createNotificationDto)
    return this.notificationService.create(createNotificationDto)
  }

  @MessagePattern('task.updated')
  findAll() {
    return this.notificationService.findAll()
  }

  @MessagePattern('task.comment.created')
  findOne(@Payload() id: number) {
    return this.notificationService.findOne(id)
  }
}
