import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { AUTH_SERVICE_NAME, AUTH_SERVICE_QUEUE } from '@repo/consts'
import { AuthController } from './modules/auth/auth.controller'

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
    ]),
  ],
  controllers: [AuthController],
  providers: [],
})
export class AppModule {}
