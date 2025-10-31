'use client'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAuth } from '@/hooks/use-auth'
import { UsersQuery } from '@/http/auth/auth.query'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import * as React from 'react'

type AssigneesSelectProps = {
  selectedIds: string[]
  onChange: (ids: string[]) => void
}

export function AssigneesSelect({
  selectedIds,
  onChange,
}: AssigneesSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')

  const { userId } = useAuth()

  // Reset search term when popover closes
  React.useEffect(() => {
    if (!open) {
      setSearchTerm('')
    }
  }, [open])

  // Fetch users with pagination
  const { data: usersData, isLoading } = useQuery(
    UsersQuery({
      page: 1,
      size: 20,
    }),
  )

  const users = usersData?.data || []

  // remove current user from the list for selection
  const usersWithoutCurrent = users.filter(user => user.id !== userId)

  const handleSelect = (userId: string) => {
    const newIds = selectedIds.includes(userId)
      ? selectedIds.filter(id => id !== userId)
      : [...selectedIds, userId]
    onChange(newIds)
    // Don't close the popover, let the user make multiple selections
    // Only close if they click outside
  }

  const handleRemove = (userId: string) => {
    onChange(selectedIds.filter(id => id !== userId))
  }

  const filteredUsers = React.useMemo(() => {
    if (!searchTerm) return usersWithoutCurrent

    const lowerSearch = searchTerm.toLowerCase()
    return usersWithoutCurrent.filter(
      user =>
        user.email?.toLowerCase().includes(lowerSearch) ||
        user.username?.toLowerCase().includes(lowerSearch),
    )
  }, [usersWithoutCurrent, searchTerm])

  const selectedUsers = users.filter(user => selectedIds.includes(user.id))

  return (
    <div className='flex flex-col gap-3'>
      {selectedUsers.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {selectedUsers.map(user => (
            <div
              key={user.id}
              className='inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm'
            >
              <span>{user.email}</span>
              <button
                onClick={() => handleRemove(user.id)}
                className='inline-flex items-center text-muted-foreground hover:text-foreground'
                type='button'
              >
                <X className='h-3 w-3' />
              </button>
            </div>
          ))}
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between'
          >
            {selectedIds.length > 0
              ? `${selectedIds.length} assignee${selectedIds.length !== 1 ? 's' : ''} selecionado${selectedIds.length !== 1 ? 's' : ''}`
              : 'Selecione os assignees...'}
            <ChevronsUpDown className='opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full p-0'>
          <Command>
            <CommandInput
              placeholder='Buscar por email ou nome de usuário...'
              className='h-9'
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              {isLoading ? (
                <CommandEmpty>Carregando usuários...</CommandEmpty>
              ) : filteredUsers.length === 0 ? (
                <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {filteredUsers.map(user => (
                    <CommandItem
                      key={user.id}
                      value={user.id}
                      onSelect={() => handleSelect(user.id)}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedIds.includes(user.id)
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      <div className='flex flex-col'>
                        <span className='font-medium'>{user.username}</span>
                        <span className='text-sm text-muted-foreground'>
                          {user.email}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {searchTerm && filteredUsers.length < usersWithoutCurrent.length && (
        <p className='text-xs text-muted-foreground'>
          Mostrando {filteredUsers.length} de {usersWithoutCurrent.length}{' '}
          usuários. Digite para filtrar.
        </p>
      )}
    </div>
  )
}
