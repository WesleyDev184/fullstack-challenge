import { useAuth } from '@/hooks/use-auth'
import { createFileRoute, Navigate } from '@tanstack/react-router'
import { RegisterForm } from './-components/register-form'

export const Route = createFileRoute('/auth/register')({
  component: Register,
  head: () => ({
    meta: [
      {
        name: 'description',
        content:
          'Create your TaskDeck account to start managing your tasks efficiently.',
      },
      {
        title: 'Register - TaskDeck',
      },
    ],
  }),
})

function Register() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    console.log('User already authenticated, redirecting to home page')
    return <Navigate to='/' />
  }
  return (
    <div className='flex h-screen flex-col items-center justify-center gap-6 p-6 md:p-10'>
      <div className='flex w-full max-w-sm flex-col gap-6'>
        <a href='#' className='flex items-center gap-2 self-center font-medium'>
          <div className='bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md'>
            <img
              src='/logo.png'
              alt='TaskDeck Logo'
              className='h-6 w-6 rounded-sm'
            />
          </div>
          TaskDeck
        </a>
        <RegisterForm />
      </div>
    </div>
  )
}
