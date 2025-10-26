import { TaskComment } from '@/shared/database/entities/task-comment.entity'
import { TaskHistory } from '@/shared/database/entities/task-history.entity'
import { Task } from '@/shared/database/entities/task.entity'
import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  NOTIFICATIONS_SERVICE_NAME,
  NOTIFICATIONS_SERVICE_QUEUE,
} from '@repo/consts'
import { TaskHistoryService } from '../tasks/task-history.service'
import { TaskCommentsController } from './task-comments.controller'
import { TaskCommentsService } from './task-comments.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskComment, Task, TaskHistory]),
    ClientsModule.register([
      {
        name: NOTIFICATIONS_SERVICE_NAME,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin@localhost:5672'],
          queue: NOTIFICATIONS_SERVICE_QUEUE,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [TaskCommentsController],
  providers: [TaskCommentsService, TaskHistoryService],
  exports: [TaskCommentsService],
})
export class TaskCommentsModule {}
