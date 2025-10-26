import { TaskAssignee } from '@/shared/database/entities/task-assignee.entity'
import { TaskComment } from '@/shared/database/entities/task-comment.entity'
import { TaskHistory } from '@/shared/database/entities/task-history.entity'
import { Task } from '@/shared/database/entities/task.entity'

import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  AUTH_SERVICE_NAME,
  AUTH_SERVICE_QUEUE,
  NOTIFICATIONS_SERVICE_NAME,
  NOTIFICATIONS_SERVICE_QUEUE,
} from '@repo/consts'
import { TaskAssigneeService } from './task-assignee.service'
import { TaskCommentService } from './task-comment.service'
import { TaskHistoryService } from './task-history.service'
import { TasksController } from './tasks.controller'
import { TasksService } from './tasks.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, TaskComment, TaskHistory, TaskAssignee]),
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
      {
        name: AUTH_SERVICE_NAME,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin@localhost:5672'],
          queue: AUTH_SERVICE_QUEUE,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [TasksController],
  providers: [
    TasksService,
    TaskCommentService,
    TaskHistoryService,
    TaskAssigneeService,
  ],
})
export class TasksModule {}
