import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Task } from './task.entity'

@Entity('task_comment')
@Index('IDX_task_comment_task_created', ['taskId', 'createdAt'])
export class TaskComment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid', name: 'task_id' })
  taskId: string

  // UUID de um usuário em outro microsserviço (sem FK)
  @Column({ type: 'uuid', name: 'author_id' })
  authorId: string

  @Column('text')
  content: string

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date

  // Relação real com a Task
  @ManyToOne(() => Task, task => task.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: Task
}
