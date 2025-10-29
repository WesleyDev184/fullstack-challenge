import { ProtectedRoute } from '@/components/protected-route'
import { HealthServiceQuery } from '@/http/health/health.query'
import { useAuth } from '@/provider/auth-provider'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_ptd/')({
  component: index,
})

function index() {
  const { data, isLoading, error } = HealthServiceQuery()
  const { user } = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ProtectedRoute>
      <h1 className='text-2xl font-bold'>Tasks de {user?.email}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </ProtectedRoute>
  )
}
