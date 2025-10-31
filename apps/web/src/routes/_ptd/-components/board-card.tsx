import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import type { Task } from '@/http/task/dto/task-dto'
import { TaskPriorityEnum } from '@/http/task/enums/task-priority.enum'
import { useDeleteTaskMutation } from '@/http/task/task-query'
import { ColorPriority } from '@/utils/color-state'
import { Link } from '@tanstack/react-router'

interface BoardCardProps {
  task: Task
}

const PRIORITY_LABELS: Record<TaskPriorityEnum, string> = {
  [TaskPriorityEnum.LOW]: 'Baixa',
  [TaskPriorityEnum.MEDIUM]: 'Média',
  [TaskPriorityEnum.HIGH]: 'Alta',
  [TaskPriorityEnum.URGENT]: 'Urgente',
}

export function BoardCard({ task }: BoardCardProps) {
  const priority = task.priority as TaskPriorityEnum
  const priorityColor = ColorPriority(priority)
  const priorityLabel = PRIORITY_LABELS[priority]
  const deleteTaskMutation = useDeleteTaskMutation()

  const handleDeleteTask = () => {
    deleteTaskMutation.mutate(task.id)
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Link to={'/task/$taskId'} params={{ taskId: task.id }}>
          <div className='bg-card rounded-lg p-3 shadow hover:shadow-md transition-all duration-200 border border-border hover:border-ring cursor-grab active:cursor-grabbing group'>
            <h3 className='font-semibold text-sm mb-2 line-clamp-2 text-foreground'>
              {task.title}
            </h3>

            <p className='text-xs text-muted-foreground mb-3 line-clamp-2'>
              {task.description}
            </p>

            <div className='flex items-center justify-between gap-2 mt-2'>
              <span
                className={`text-xs px-2 py-0.5 rounded-md font-medium ${priorityColor}`}
              >
                {priorityLabel}
              </span>

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
        </Link>
      </ContextMenuTrigger>
      <ContextMenuContent className='w-52'>
        <ContextMenuItem inset asChild>
          <Link
            to={'/task/$taskId'}
            params={{ taskId: task.id }}
            search={{
              editTaskOpen: 'true',
            }}
            className='text-yellow-500'
          >
            Editar
          </Link>
        </ContextMenuItem>

        <ContextMenuItem inset asChild>
          <button
            type='button'
            className='text-destructive w-full'
            disabled={deleteTaskMutation.isPending}
            onClick={handleDeleteTask}
          >
            {deleteTaskMutation.isPending ? 'Deletando...' : 'Delete'}
          </button>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
