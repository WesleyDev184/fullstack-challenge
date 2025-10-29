import { useAuth } from '@/provider/auth-provider'
import { Navigate } from '@tanstack/react-router'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, accessToken } = useAuth()

  if (!user || !accessToken) {
    return <Navigate to='/auth/login' />
  }

  return (
    <div className='flex items-start justify-center w-full h-full p-2 border border-amber-300 '>
      {children}
    </div>
  )
}
