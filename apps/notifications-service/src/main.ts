import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { NOTIFICATIONS_SERVICE_QUEUE } from '@repo/consts'
import { CustomLoggerService } from '@repo/logger'
import 'dotenv/config'
import { AppModule } from './app.module'

async function bootstrap() {
  const logger = new Logger()
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLoggerService(),
  })

  app.enableCors()

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:admin@localhost:5672'],
      queue: NOTIFICATIONS_SERVICE_QUEUE,
      queueOptions: {
        durable: true,
      },
    },
  })

  await app.startAllMicroservices()
  await app.listen(process.env.PORT || 3004)
  logger.log(
    `Notifications Service is running on RMQ and HTTP on port ${process.env.PORT || 3004}`,
  )
}

void bootstrap()
