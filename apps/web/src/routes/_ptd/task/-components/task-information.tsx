import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { EmailsQuery } from '@/http/auth/auth.query'
import type { Task } from '@/http/task/dto/task-dto'
import { TaskPriorityEnum } from '@/http/task/enums/task-priority.enum'
import { TaskStatusEnum } from '@/http/task/enums/task-status.enum'
import { ColorPriority, ColorStatus } from '@/utils/color-state'
import { useSuspenseQuery } from '@tanstack/react-query'

type TaskInformationProps = {
  task: Task
}

export function TaskInformation({ task }: TaskInformationProps) {
  const assigneesIds = [...task?.assignees.map(assignee => assignee.userId)]
  const { data: emailMap } = useSuspenseQuery(EmailsQuery(assigneesIds))

  const PRIORITY_LABELS: Record<TaskPriorityEnum, string> = {
    [TaskPriorityEnum.LOW]: 'Baixa',
    [TaskPriorityEnum.MEDIUM]: 'Média',
    [TaskPriorityEnum.HIGH]: 'Alta',
    [TaskPriorityEnum.URGENT]: 'Urgente',
  }

  const STATUS_LABELS: Record<TaskStatusEnum, string> = {
    [TaskStatusEnum.TODO]: 'A FAZER',
    [TaskStatusEnum.IN_PROGRESS]: 'EM ANDAMENTO',
    [TaskStatusEnum.REVIEW]: 'REVISÃO',
    [TaskStatusEnum.DONE]: 'CONCLUÍDO',
  }

  return (
    <div className='col-span-1 overflow-hidden bg-muted'>
      <div className='border rounded-lg p-6 space-y-6 h-full overflow-y-auto'>
        {/* Description */}
        <div>
          <h3 className='font-semibold mb-2'>Description</h3>
          <p className='text-sm text-muted-foreground'>{task.description}</p>
        </div>

        {/* Status */}
        <div>
          <h3 className='font-semibold mb-2'>Status</h3>
          <div
            className={`text-sm w-max px-2 py-0.5 rounded-md font-medium ${ColorStatus(
              task.status as TaskStatusEnum,
            )}`}
          >
            {STATUS_LABELS[task.status as TaskStatusEnum]}
          </div>
        </div>

        {/* Priority */}
        <div>
          <h3 className='font-semibold mb-2'>Priority</h3>
          <div
            className={`text-sm w-max px-2 py-0.5 rounded-md font-medium ${ColorPriority(
              task.priority as TaskPriorityEnum,
            )}`}
          >
            {PRIORITY_LABELS[task.priority as TaskPriorityEnum]}
          </div>
        </div>

        {/* Due Date */}
        <div>
          <h3 className='font-semibold mb-2'>Expira em</h3>
          <p className='text-sm text-muted-foreground'>
            {new Date(task.dueAt).toLocaleDateString('pt-BR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        {/* Assignees */}
        <div>
          <h3 className='font-semibold mb-3'>Assignees</h3>
          <div className='flex flex-wrap gap-2 w-full'>
            {assigneesIds && assigneesIds.length > 0 ? (
              assigneesIds.map(userId => {
                const email = emailMap[userId]
                const username = email?.split('@')[0] || 'Unknown'
                const initials = username.slice(0, 2).toUpperCase()

                return (
                  <div key={userId} className='flex items-center gap-1'>
                    <Avatar
                      className='h-8 w-8 text-primary text-xs font-medium shrink-0'
                      title={email}
                    >
                      <AvatarFallback className='bg-card'>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className='text-sm text-muted-foreground truncate'>
                      {email}
                    </span>
                  </div>
                )
              })
            ) : (
              <p className='text-sm text-muted-foreground'>No assignees</p>
            )}
          </div>
        </div>

        {/* Created */}
        <div>
          <h3 className='font-semibold mb-2'>Created</h3>
          <p className='text-sm text-muted-foreground'>
            {new Date(task.createdAt).toLocaleDateString('pt-BR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        {/* Updated */}
        <div>
          <h3 className='font-semibold mb-2'>Updated</h3>
          <p className='text-sm text-muted-foreground'>
            {new Date(task.updatedAt).toLocaleDateString('pt-BR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    </div>
  )
}
