import { NotificationCategoryEnum } from '@repo/types'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('notification')
@Index('IDX_notification_assignee_ids', ['assigneeIds'])
@Index('IDX_notification_created_at', ['createdAt'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('uuid', { name: 'assignee_ids', array: true, default: () => "'{}'" })
  assigneeIds: string[]

  @Column('varchar')
  title: string

  @Column('text')
  content: string

  @Column({
    type: 'enum',
    enum: NotificationCategoryEnum,
  })
  category: NotificationCategoryEnum

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date
}
