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
      return 'bg-emerald-200 text-emerald-700'
    case TaskPriorityEnum.MEDIUM:
      return 'bg-yellow-200 text-yellow-700'
    case TaskPriorityEnum.HIGH:
      return 'bg-red-200 text-red-700'
    case TaskPriorityEnum.URGENT:
      return 'bg-purple-200 text-purple-700'
    default:
      return 'bg-gray-200'
  }
}
