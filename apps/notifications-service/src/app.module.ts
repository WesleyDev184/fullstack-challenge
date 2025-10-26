import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { NotificationModule } from './notification/notification.module'
import { DatabaseModule } from './shared/database/database.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
