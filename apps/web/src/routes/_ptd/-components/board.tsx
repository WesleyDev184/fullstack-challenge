import { TaskStatusEnum } from '@/http/task/enums/task-status.enum'
import { TasksQuery } from '@/http/task/task-query'
import { ColorStatus } from '@/utils/color-state'
import { useSuspenseQuery } from '@tanstack/react-query'
import { BoardCard } from './board-card'
import { BoardColumn } from './board-column'

const STATUS_LABELS: Record<TaskStatusEnum, string> = {
  [TaskStatusEnum.TODO]: 'A FAZER',
  [TaskStatusEnum.IN_PROGRESS]: 'EM ANDAMENTO',
  [TaskStatusEnum.REVIEW]: 'REVISÃO',
  [TaskStatusEnum.DONE]: 'CONCLUÍDO',
}

interface BoardProps {
  userName: string
}

export function Board({ userName }: BoardProps) {
  const columns = Object.values(TaskStatusEnum).map(status => ({
    key: status,
    label: STATUS_LABELS[status],
  }))

  const { data: tasks } = useSuspenseQuery(TasksQuery({ page: 1, size: 20 }))

  const getTasksByStatus = (status: TaskStatusEnum) => {
    return tasks?.data.filter(task => task.status === status) ?? []
  }

  return (
    <div className='w-full h-full flex flex-col gap-6 p-6 bg-secondary rounded-xl'>
      {/* Header */}
      <div className='flex flex-col items-start gap-2'>
        <div className='flex items-center gap-3'>
          <div className='h-4 w-4 rounded-full bg-primary'></div>
          <h1 className='text-xl font-semibold'>
            Board de Tarefas - {userName}
          </h1>
        </div>
        <span className='text-sm text-muted-foreground'>
          Gerencie suas tarefas de forma visual
        </span>
      </div>

      {/* Kanban Board */}
      <div className='flex overflow-x-auto gap-4 flex-1 pb-2 justify-center max-h-full'>
        {columns.map(column => {
          const tasksRes = getTasksByStatus(column.key as TaskStatusEnum)

          return (
            <BoardColumn
              key={column.key}
              label={column.label}
              colorDot={ColorStatus(column.key as TaskStatusEnum)}
              count={tasksRes.length}
            >
              {tasksRes.map(task => (
                <BoardCard key={task.id} task={task} />
              ))}
            </BoardColumn>
          )
        })}
      </div>
    </div>
  )
}
