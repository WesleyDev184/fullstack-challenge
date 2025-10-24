import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { NOTIFICATIONS_SERVICE_QUEUE } from '@repo/consts'
import 'dotenv/config'
import { AppModule } from './app.module'

async function bootstrap() {
  const logger = new Logger()
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:admin@localhost:5672'],
        queue: NOTIFICATIONS_SERVICE_QUEUE,
        queueOptions: {
          durable: true,
        },
      },
    },
  )
  await app.listen()
  logger.log(`Notifications Service is running on RMQ`)
}

void bootstrap()
