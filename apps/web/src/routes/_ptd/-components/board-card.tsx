import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { TaskDto } from '@/http/task/dto/task-dto'
import { TaskPriorityEnum } from '@/http/task/enums/task-priority.enum'

interface BoardCardProps {
  task: TaskDto
}

const PRIORITY_COLORS: Record<TaskPriorityEnum, string> = {
  [TaskPriorityEnum.LOW]: 'bg-blue-100 text-blue-700',
  [TaskPriorityEnum.MEDIUM]: 'bg-yellow-100 text-yellow-700',
  [TaskPriorityEnum.HIGH]: 'bg-red-100 text-red-700',
  [TaskPriorityEnum.URGENT]: 'bg-red-200 text-red-900',
}

const PRIORITY_LABELS: Record<TaskPriorityEnum, string> = {
  [TaskPriorityEnum.LOW]: 'Baixa',
  [TaskPriorityEnum.MEDIUM]: 'Média',
  [TaskPriorityEnum.HIGH]: 'Alta',
  [TaskPriorityEnum.URGENT]: 'Urgente',
}

export function BoardCard({ task }: BoardCardProps) {
  const priority = task.priority as TaskPriorityEnum
  const priorityColor = PRIORITY_COLORS[priority]
  const priorityLabel = PRIORITY_LABELS[priority]

  return (
    <div className='bg-card rounded-lg p-3 shadow hover:shadow-md transition-all duration-200 border border-border hover:border-ring cursor-grab active:cursor-grabbing group'>
      {/* Card Title */}
      <h3 className='font-semibold text-sm mb-2 line-clamp-2 text-foreground'>
        {task.title}
      </h3>

      {/* Card Description */}
      <p className='text-xs text-muted-foreground mb-3 line-clamp-2'>
        {task.description}
      </p>

      {/* Card Footer */}
      <div className='flex items-center justify-between gap-2 mt-2'>
        {/* Priority Badge */}
        <span
          className={`text-xs px-2 py-0.5 rounded-md font-medium ${priorityColor}`}
        >
          {priorityLabel}
        </span>

        {/* Assignees */}
        <div className='ml-auto flex -space-x-2'>
          {task.assignees.slice(0, 2).map((assignee, index) => (
            <Avatar
              key={assignee.userId}
              className='h-8 w-8 text-primary border-2 border-card'
            >
              <AvatarFallback className='text-xs'>
                {String.fromCharCode(65 + (index % 26))}
              </AvatarFallback>
            </Avatar>
          ))}
          {task.assignees.length > 2 && (
            <div className='h-8 w-8 text-primary rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-medium'>
              +{task.assignees.length - 2}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
