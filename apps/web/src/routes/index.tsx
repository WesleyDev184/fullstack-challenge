import { HealthServiceQuery } from '@/http/health/health.query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: index,
})

function index() {
  const { data, isLoading, error } = HealthServiceQuery()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className='flex items-start justify-center w-full h-full p-2 border border-amber-300 '>
      <h1 className='text-2xl font-bold'>Tasks</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
