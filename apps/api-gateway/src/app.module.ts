import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import {
  AUTH_SERVICE_NAME,
  AUTH_SERVICE_QUEUE,
  TASKS_SERVICE_NAME,
  TASKS_SERVICE_QUEUE,
} from '@repo/consts'
import { AuthController } from './modules/auth/auth.controller'
import { TasksController } from './modules/tasks/tasks.controller'

@Module({
  imports: [
    ClientsModule.register([
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
      {
        name: TASKS_SERVICE_NAME,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin@localhost:5672'],
          queue: TASKS_SERVICE_QUEUE,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [AuthController, TasksController],
  providers: [],
})
export class AppModule {}
