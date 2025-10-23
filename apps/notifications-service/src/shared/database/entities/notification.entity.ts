import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { NotificationCategoryEnum } from '../enums/notification-category.enum'

@Entity('notification')
@Index('IDX_notification_recipient_created_at', ['recipientId', 'createdAt'])
@Index('IDX_notification_recipient_unread', ['readAt'], {
  where: '"read_at" IS NULL',
})
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid', name: 'recipient_id' })
  recipientId: string

  @Column('varchar')
  title: string

  @Column('text')
  content: string

  @Column({
    type: 'enum',
    enum: NotificationCategoryEnum,
  })
  category: NotificationCategoryEnum

  @Column({ type: 'timestamp', nullable: true, name: 'read_at' })
  readAt: Date

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date
}
