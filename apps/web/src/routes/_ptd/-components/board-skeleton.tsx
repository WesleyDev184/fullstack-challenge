import { Skeleton } from '@/components/ui/skeleton'
import { TaskStatusEnum } from '@/http/task/enums/task-status.enum'
import { ColorStatus } from '@/utils/color-state'
import { BoardCardSkeleton } from './board-card-skeleton'
import { BoardColumn } from './board-column'

const STATUS_LABELS: Record<TaskStatusEnum, string> = {
  [TaskStatusEnum.TODO]: 'A FAZER',
  [TaskStatusEnum.IN_PROGRESS]: 'EM ANDAMENTO',
  [TaskStatusEnum.REVIEW]: 'REVISÃO',
  [TaskStatusEnum.DONE]: 'CONCLUÍDO',
}

export function BoardSkeleton() {
  const columns = Object.values(TaskStatusEnum).map(status => ({
    key: status,
    label: STATUS_LABELS[status],
  }))

  return (
    <div className='w-full h-full flex flex-col gap-6 p-6 bg-secondary rounded-xl'>
      {/* Header */}
      <div className='flex items-center gap-3'>
        <div className='h-4 w-4 rounded-full bg-primary'></div>
        <Skeleton className='h-6 w-40' />
      </div>
      <span>
        <Skeleton className='h-4 w-24' />
      </span>

      {/* Kanban Board */}
      <div className='flex overflow-x-auto gap-4 flex-1 pb-2 justify-center max-h-full'>
        {columns.map(column => (
          <BoardColumn
            key={column.key}
            label={column.label}
            colorDot={ColorStatus(column.key as TaskStatusEnum)}
            count={0}
          >
            {[0, 1, 2, 3].map(index => (
              <BoardCardSkeleton key={index} />
            ))}
          </BoardColumn>
        ))}
      </div>
    </div>
  )
}
