import { useAuth } from '@/hooks/use-auth'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { Board } from './-components/board'
import { BoardSkeleton } from './-components/board-skeleton'

export const Route = createFileRoute('/_ptd/')({
  component: index,
})

function index() {
  const { user } = useAuth()

  return (
    <div className='flex flex-col justify-start items-center w-full h-full p-4'>
      <Suspense fallback={<BoardSkeleton />}>
        <Board userName={user?.username ?? 'guest'} />
      </Suspense>
    </div>
  )
}
