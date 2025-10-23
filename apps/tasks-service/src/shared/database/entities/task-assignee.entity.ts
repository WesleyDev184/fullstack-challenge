import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm'
import { Task } from './task.entity'

@Entity('task_assignee')
export class TaskAssignee {
  @PrimaryColumn({ type: 'uuid', name: 'task_id' })
  taskId: string

  // UUID de um usuário em outro microsserviço (sem FK)
  @PrimaryColumn({ type: 'uuid', name: 'user_id' })
  @Index('IDX_task_assignee_user', ['userId'])
  userId: string

  @CreateDateColumn({ type: 'timestamp', name: 'assigned_at' })
  assignedAt: Date

  // Relação real com a Task
  @ManyToOne(() => Task, task => task.assignees, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: Task
}
