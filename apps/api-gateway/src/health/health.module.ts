import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { TerminusModule } from '@nestjs/terminus'
import {
  AUTH_SERVICE_NAME,
  AUTH_SERVICE_QUEUE,
  NOTIFICATIONS_SERVICE_NAME,
  NOTIFICATIONS_SERVICE_QUEUE,
  TASKS_SERVICE_NAME,
  TASKS_SERVICE_QUEUE,
} from '@repo/consts'
import { HealthController } from './health.controller'

@Module({
  imports: [
    TerminusModule,
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
  controllers: [HealthController],
})
export class HealthModule {}
