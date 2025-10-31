import { z } from 'zod'
import { TaskPriorityEnum } from '../enums/task-priority.enum'
import { TaskStatusEnum } from '../enums/task-status.enum'

export type TaskAssigneeDto = {
  taskId: string
  userId: string
  assignedAt: Date
}

export type TaskCommentDto = {
  id: string
  taskId: string
  authorId: string
  content: string
  createdAt: Date
}

export type TaskHistoryDto = {
  id: string
  taskId: string
  actorId: string
  change: string
  metadata: Record<string, any>
  createdAt: Date
}

export type Task = {
  id: string
  title: string
  description: string
  content: string
  dueAt: Date
  priority: string
  status: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
  assignees: TaskAssigneeDto[]
  comments: TaskCommentDto[]
  history: TaskHistoryDto[]
}

export const updateTaskDtoSchema = z.object({
  title: z.string().min(3).optional(),
  content: z.string().optional(),
  description: z.string().optional(),
  dueAt: z.date().optional(),
  priority: z.nativeEnum(TaskPriorityEnum).optional(),
  status: z.nativeEnum(TaskStatusEnum).optional(),
  assigneeIds: z.array(z.string().uuid()).optional(),
})

export type UpdateTaskDto = z.infer<typeof updateTaskDtoSchema>
