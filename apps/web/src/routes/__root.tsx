import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Toaster } from '@/components/ui/sonner'
import { HealthServiceQuery } from '@/http/health/health.query'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { useQuery, type QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { AlertCircle } from 'lucide-react'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
})

function RootComponent() {
  const { data } = useQuery(HealthServiceQuery())

  const downServices = data
    ? Object.entries(data.details).filter(
        ([_, service]) => service.status !== 'up',
      )
    : []

  return (
    <>
      <HeadContent />
      <Outlet />
      <Toaster position='bottom-right' />
      {downServices.length > 0 && (
        <div className='fixed top-4 right-4 z-50 max-w-sm'>
          <Alert variant='destructive'>
            <AlertCircle />
            <AlertTitle>Services Unavailable</AlertTitle>
            <AlertDescription>
              <p>The following services are currently down:</p>
              <ul className='list-inside list-disc text-sm'>
                {downServices.map(([serviceName, service]) => (
                  <li key={serviceName}>
                    {serviceName}: {service.message}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      )}
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  )
}
