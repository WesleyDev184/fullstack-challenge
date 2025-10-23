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

@Entity('task_history')
@Index('IDX_task_history_task_created', ['taskId', 'createdAt'])
export class TaskHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid', name: 'task_id' })
  taskId: string

  // UUID de um usuário em outro microsserviço (sem FK)
  // Nulo, pois pode ser uma ação do sistema
  @Column({ type: 'uuid', name: 'actor_id', nullable: true })
  actorId: string

  @Column('text')
  change: string

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date

  // Relação real com a Task
  @ManyToOne(() => Task, task => task.history, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: Task
}
