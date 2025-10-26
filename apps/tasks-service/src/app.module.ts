import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { DatabaseModule } from './shared/database/database.module'
import { TaskCommentsModule } from './task-comments/task-comments.module'
import { TasksModule } from './tasks/tasks.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TasksModule,
    TaskCommentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
