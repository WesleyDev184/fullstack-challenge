export interface TaskAssigneeDto {
  taskId: string
  userId: string
  assignedAt: Date
}

export interface TaskDto {
  id: string
  title: string
  description: string
  dueAt: Date
  priority: string
  status: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
  assignees: TaskAssigneeDto[]
}
