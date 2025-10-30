import { useAuth } from '@/hooks/use-auth'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Board } from './-components/board'

export const Route = createFileRoute('/_ptd/')({
  component: index,
})

function index() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular requisição com delay de 2 segundos
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className='flex flex-col justify-start items-center w-full h-full p-4'>
      <Board userName={user?.username ?? 'guest'} isLoading={isLoading} />
    </div>
  )
}
