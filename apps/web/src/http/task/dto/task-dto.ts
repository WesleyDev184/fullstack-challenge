export interface TaskAssigneeDto {
  taskId: string
  userId: string
  assignedAt: Date
}

export interface TaskCommentDto {
  id: string
  taskId: string
  authorId: string
  content: string
  createdAt: Date
}

export interface TaskHistoryDto {
  id: string
  taskId: string
  actorId: string
  change: string
  metadata: Record<string, any>
  createdAt: Date
}

export interface Task {
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
