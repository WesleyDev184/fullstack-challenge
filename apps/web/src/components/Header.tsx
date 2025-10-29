import { useAuth } from '@/provider/auth-provider'
import { Link } from '@tanstack/react-router'
import AuthDropdown from './auth-dropdpwn'
import { ModeToggle } from './mode-toggle'

export default function Header() {
  const { user } = useAuth()

  return (
    <header className='px-6 flex gap-2 bg-muted justify-between border-b border-border h-[6vh]'>
      <nav className='font-bold text-primary flex flex-row items-center gap-2'>
        <div className='flex items-center gap-1 font-bold bg-linear-to-r from-blue-400 to-primary bg-clip-text text-transparent'>
          <img
            src='/logo.png'
            alt='Logo'
            className='inline w-10 rounded-full'
          />
          <Link to='/'>TaskDeck</Link>
        </div>
      </nav>
      <div className='flex items-center justify-center gap-2'>
        <ModeToggle />
        <AuthDropdown
          user={{
            id: user?.id || '1',
            email: user?.email || 'email@example.com',
            username: user?.username || 'username',
            createdAt: user?.createdAt || '2023-10-24T08:32:36.588Z',
            updatedAt: user?.updatedAt || '2025-10-24T08:32:36.588Z',
          }}
        />
      </div>
    </header>
  )
}
