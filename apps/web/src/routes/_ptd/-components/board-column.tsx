import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ReactNode } from 'react'

export interface BoardColumnProps {
  label: string
  colorDot: string
  count?: number
  children: ReactNode
  onAddClick?: () => void
}

export function BoardColumn({
  label,
  colorDot,
  count = 0,
  children,
  onAddClick,
}: BoardColumnProps) {
  return (
    <div className='shrink-0 w-80 h-full rounded-xl p-4 flex flex-col shadow-lg border border-border bg-card/50 hover:shadow-xl transition-shadow duration-300'>
      <div className='flex items-center gap-2 mb-4'>
        <div className={`h-3 w-3 rounded-full ${colorDot}`}></div>
        <h3 className='font-bold text-sm text-foreground uppercase tracking-wider'>
          {label}
        </h3>
        <span className='ml-auto text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded'>
          {count}
        </span>
      </div>

      <div className='h-px bg-border mb-3'></div>

      <ScrollArea className='flex-1 overflow-y-auto'>
        <div className='flex flex-col gap-2'>{children}</div>
      </ScrollArea>

      <Button
        onClick={onAddClick}
        variant={'ghost'}
        className='w-full mt-3 p-2 rounded-lg border border-dashed border-border hover:border-ring text-muted-foreground hover:text-foreground text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2'
      >
        <span className='text-lg'>+</span>
        Adicionar
      </Button>
    </div>
  )
}
