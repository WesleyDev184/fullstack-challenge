'use client'

import { ChevronDownIcon } from 'lucide-react'
import { useQueryState } from 'nuqs'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DatePickerProps {
  prefix?: string
}

export function DatePicker(props: DatePickerProps) {
  const [open, setOpen] = useQueryState(
    `${props.prefix ? `${props.prefix}-` : ''}open`,
    {
      defaultValue: false,
      parse: value => value === 'true',
      serialize: value => (value ? 'true' : 'false'),
    },
  )
  const [date, setDate] = useQueryState(
    `${props.prefix ? `${props.prefix}-` : ''}date`,
    {
      defaultValue: null,
      parse: value => (value ? new Date(value) : null),
      serialize: value => (value ? value.toISOString() : ''),
    },
  )

  return (
    <div className='flex flex-col gap-3'>
      <Label htmlFor='date' className='px-1'>
        Date of birth
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            id='date'
            className='w-48 justify-between font-normal'
          >
            {date ? date.toLocaleDateString() : 'Select date'}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
          <Calendar
            mode='single'
            selected={date || undefined}
            captionLayout='dropdown'
            onSelect={selectedDate => {
              setDate(selectedDate || null)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
