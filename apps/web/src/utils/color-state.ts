import { TaskPriorityEnum } from '@/http/task/enums/task-priority.enum'
import { TaskStatusEnum } from '@/http/task/enums/task-status.enum'

export function ColorStatus(status: TaskStatusEnum): string {
  switch (status) {
    case TaskStatusEnum.TODO:
      return 'bg-primary'
    case TaskStatusEnum.IN_PROGRESS:
      return 'bg-orange-500'
    case TaskStatusEnum.DONE:
      return 'bg-emerald-500'
    case TaskStatusEnum.REVIEW:
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
}

export function ColorPriority(priority: TaskPriorityEnum): string {
  switch (priority) {
    case TaskPriorityEnum.LOW:
      return 'bg-emerald-500'
    case TaskPriorityEnum.MEDIUM:
      return 'bg-yellow-500'
    case TaskPriorityEnum.HIGH:
      return 'bg-destructive'
    case TaskPriorityEnum.URGENT:
      return 'bg-purple-500'
    default:
      return 'bg-gray-500'
  }
}
