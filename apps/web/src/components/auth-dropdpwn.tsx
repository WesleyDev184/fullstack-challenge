import { UserRoundIcon } from 'lucide-react'

import { useAuth } from '@/hooks/use-auth'
import { Link } from '@tanstack/react-router'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

interface User {
  id: string
  email: string
  username: string
  createdAt: string
  updatedAt: string
}

interface AuthDropdownProps {
  user: User
}

export default function AuthDropdown({ user }: AuthDropdownProps) {
  const { logout } = useAuth()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon'>
          <UserRoundIcon
            size={20}
            className=' text-primary'
            aria-hidden='true'
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='start'>
        <DropdownMenuLabel>Conta de {user.username}</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>
            <div className='flex flex-col'>
              <span className='font-medium'>E-mail</span>
              <span className='text-sm text-muted-foreground'>
                {user.email}
              </span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <div className='flex flex-col'>
              <span className='font-medium'>Nome de usuário</span>
              <span className='text-sm text-muted-foreground'>
                {user.username}
              </span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <div className='flex flex-col'>
              <span className='font-medium'>Membro desde</span>
              <span className='text-sm text-muted-foreground'>
                {formatDate(user.createdAt)}
              </span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <div className='flex flex-col'>
              <span className='font-medium'>Última atualização</span>
              <span className='text-sm text-muted-foreground'>
                {formatDate(user.updatedAt)}
              </span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            to='.'
            href='https://github.com/WesleyDev184/fullstack-challenge'
          >
            GitHub
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to='.' href='https://wadev.com.br'>
            Suporte
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button
            variant='outline'
            size='default'
            className='w-full text-destructive'
            onClick={logout}
          >
            Sair
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
