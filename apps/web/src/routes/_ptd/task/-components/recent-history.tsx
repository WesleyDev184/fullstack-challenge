import { EmailsQuery } from '@/http/auth/auth.query'
import type { TaskHistoryDto } from '@/http/task/dto/task-dto'
import { useSuspenseQuery } from '@tanstack/react-query'

type RecentHistoryProps = {
  history: TaskHistoryDto[]
}

export function RecentHistory({ history }: RecentHistoryProps) {
  // Pegar apenas os 2 primeiros do histórico e extrair seus IDs únicos
  const topTwoHistory = history?.slice(0, 2) || []
  const actorIds = Array.from(
    new Set(topTwoHistory.map(entry => entry.actorId)),
  )
  const { data: emailMap } = useSuspenseQuery(EmailsQuery(actorIds))

  return (
    <div>
      <h2 className='text-lg font-semibold mb-3'>Recent Activity</h2>
      <div className='space-y-3'>
        {topTwoHistory && topTwoHistory.length > 0 ? (
          topTwoHistory.map(entry => (
            <div key={entry.id} className='border rounded-lg p-4'>
              <p className='text-sm text-muted-foreground mb-2'>
                {emailMap[entry.actorId]} •{' '}
                {new Date(entry.createdAt).toLocaleDateString('pt-BR')}
              </p>
              <p className='font-medium'>{entry.change}</p>
              {entry.metadata && (
                <pre className='mt-2 bg-muted p-2 rounded text-xs overflow-auto'>
                  {JSON.stringify(entry.metadata, null, 2)}
                </pre>
              )}
            </div>
          ))
        ) : (
          <p className='text-muted-foreground'>No activity yet</p>
        )}
      </div>
    </div>
  )
}
