import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { TaskPriorityEnum } from '../enums/task-priority.enum'
import { TaskStatusEnum } from '../enums/task-status.enum'
import { TaskAssignee } from './task-assignee.entity'
import { TaskComment } from './task-comment.entity'
import { TaskHistory } from './task-history.entity'

@Entity('task')
@Index('IDX_task_kanban_view', ['status', 'priority', 'dueAt'])
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  title: string

  @Column('text', { nullable: true })
  description: string

  @Index('IDX_task_due_at', ['dueAt'])
  @Column({ type: 'timestamp', nullable: true, name: 'due_at' })
  dueAt: Date

  @Column({
    type: 'enum',
    enum: TaskPriorityEnum,
    default: TaskPriorityEnum.MEDIUM,
  })
  priority: TaskPriorityEnum

  @Column({
    type: 'enum',
    enum: TaskStatusEnum,
    default: TaskStatusEnum.TODO,
  })
  status: TaskStatusEnum

  // UUID de um usuário em outro microsserviço (sem FK)
  @Index('IDX_task_created_by', ['createdBy'])
  @Column({ type: 'uuid', name: 'created_by' })
  createdBy: string

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date

  // RELAÇÕES DENTRO DESTE "SERVIÇO"
  @OneToMany(() => TaskAssignee, assignee => assignee.task)
  assignees: TaskAssignee[]

  @OneToMany(() => TaskComment, comment => comment.task)
  comments: TaskComment[]

  @OneToMany(() => TaskHistory, history => history.task)
  history: TaskHistory[]
}
