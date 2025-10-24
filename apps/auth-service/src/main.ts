import { NestFactory } from '@nestjs/core'
import 'dotenv/config'

import { Logger } from '@nestjs/common'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { AUTH_SERVICE_QUEUE } from '@repo/consts'
import { AppModule } from './app.module'

async function bootstrap() {
  const logger = new Logger()
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:admin@localhost:5672'],
        queue: AUTH_SERVICE_QUEUE,
        queueOptions: {
          durable: true,
        },
      },
    },
  )
  await app.listen()
  logger.log(`Auth Service is running on RMQ`)
}

void bootstrap()
