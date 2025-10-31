'use client'

import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Task, UpdateTaskDto } from '@/http/task/dto/task-dto'
import { updateTaskDtoSchema } from '@/http/task/dto/task-dto'
import { TaskPriorityEnum } from '@/http/task/enums/task-priority.enum'
import { TaskStatusEnum } from '@/http/task/enums/task-status.enum'
import { useUpdateTaskMutation } from '@/http/task/task-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pen } from 'lucide-react'
import { parseAsBoolean, useQueryState } from 'nuqs'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { AssigneesSelect } from './assignees-select'

type EditTaskDialogProps = {
  task: Task
  children?: React.ReactNode
}

export function EditTaskDialog({ task, children }: EditTaskDialogProps) {
  const [open, setOpen] = useQueryState(
    'editTaskOpen',
    parseAsBoolean.withDefault(false),
  )
  const [dueDateQuery, setDueDateQuery] = useQueryState('editTaskDueDate-date')

  const updateTaskMutation = useUpdateTaskMutation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<UpdateTaskDto>({
    resolver: zodResolver(updateTaskDtoSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      dueAt: task.dueAt ? new Date(task.dueAt) : undefined,
      priority:
        task.priority as unknown as (typeof TaskPriorityEnum)[keyof typeof TaskPriorityEnum],
      status:
        task.status as unknown as (typeof TaskStatusEnum)[keyof typeof TaskStatusEnum],
      assigneeIds: task.assignees.map(a => a.userId),
    },
  })

  useEffect(() => {
    if (open && task) {
      reset({
        title: task.title,
        description: task.description,
        dueAt: task.dueAt ? new Date(task.dueAt) : undefined,
        priority:
          task.priority as unknown as (typeof TaskPriorityEnum)[keyof typeof TaskPriorityEnum],
        status:
          task.status as unknown as (typeof TaskStatusEnum)[keyof typeof TaskStatusEnum],
        assigneeIds: task.assignees.map(a => a.userId),
      })

      setDueDateQuery(task.dueAt ? new Date(task.dueAt).toISOString() : null)
    }
  }, [open, task, reset, setDueDateQuery])

  useEffect(() => {
    if (dueDateQuery) {
      const date = new Date(dueDateQuery)
      setValue('dueAt', date)
    } else {
      setValue('dueAt', undefined)
    }
  }, [dueDateQuery, setValue])

  const getChangedFields = (data: UpdateTaskDto): Partial<UpdateTaskDto> => {
    const changed: Partial<UpdateTaskDto> = {}

    if (data.title !== task.title) {
      changed.title = data.title
    }

    if (data.description !== task.description) {
      changed.description = data.description
    }

    const currentDueAt = data.dueAt ? new Date(data.dueAt).getTime() : null
    const originalDueAt = task.dueAt ? new Date(task.dueAt).getTime() : null

    if (currentDueAt !== originalDueAt) {
      changed.dueAt = data.dueAt
    }

    if (data.priority && data.priority !== task.priority) {
      changed.priority = data.priority
    }

    if (data.status && data.status !== task.status) {
      changed.status = data.status
    }

    const originalAssigneeIds = task.assignees.map(a => a.userId)
    const newAssigneeIds = data.assigneeIds || []

    if (
      JSON.stringify(originalAssigneeIds.sort()) !==
      JSON.stringify(newAssigneeIds.sort())
    ) {
      changed.assigneeIds = data.assigneeIds
    }

    return changed
  }

  const onSubmit = async (data: UpdateTaskDto) => {
    try {
      const changedFields = getChangedFields(data)

      if (Object.keys(changedFields).length === 0) {
        toast.info('Nenhuma alteração foi feita')
        return
      }

      await updateTaskMutation.mutateAsync({
        id: task.id,
        data: changedFields as UpdateTaskDto,
      })
      await setDueDateQuery(null)
      await setOpen(false)
    } catch (error) {
      toast.error('Erro ao atualizar tarefa')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant='outline' size={'icon'}>
            <Pen className='text-yellow-500' />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
          <DialogDescription>
            Atualize os detalhes da sua tarefa
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <FieldGroup>
            <FieldSeparator className='*:data-[slot=field-separator-content]:bg-card'>
              Informações Básicas
            </FieldSeparator>

            {/* Title */}
            <Field>
              <FieldLabel htmlFor='title'>Título</FieldLabel>
              <Input
                id='title'
                type='text'
                placeholder='Título da tarefa'
                {...register('title')}
              />
              {errors.title && <FieldError>{errors.title.message}</FieldError>}
            </Field>

            {/* Description */}
            <Field>
              <FieldLabel htmlFor='description'>Descrição</FieldLabel>
              <Textarea
                id='description'
                placeholder='Descrição detalhada da tarefa'
                {...register('description')}
              />
              {errors.description && (
                <FieldError>{errors.description.message}</FieldError>
              )}
            </Field>
          </FieldGroup>

          <FieldGroup>
            <FieldSeparator className='*:data-[slot=field-separator-content]:bg-card'>
              Detalhes da Tarefa
            </FieldSeparator>

            {/* Due Date */}
            <Field>
              <DatePicker prefix='editTaskDueDate' />
            </Field>

            {/* Priority */}
            <Field>
              <FieldLabel htmlFor='priority'>Prioridade</FieldLabel>
              <Select
                value={watch('priority') || ''}
                onValueChange={value => setValue('priority', value as any)}
              >
                <SelectTrigger id='priority'>
                  <SelectValue placeholder='Selecione uma prioridade' />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TaskPriorityEnum).map(priority => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.priority && (
                <FieldError>{errors.priority.message}</FieldError>
              )}
            </Field>

            {/* Status */}
            <Field>
              <FieldLabel htmlFor='status'>Status</FieldLabel>
              <Select
                value={watch('status') || ''}
                onValueChange={value => setValue('status', value as any)}
              >
                <SelectTrigger id='status'>
                  <SelectValue placeholder='Selecione um status' />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TaskStatusEnum).map(status => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <FieldError>{errors.status.message}</FieldError>
              )}
            </Field>

            {/* Assignees */}
            <Field>
              <FieldLabel htmlFor='assignees'>Designados</FieldLabel>
              <AssigneesSelect
                selectedIds={watch('assigneeIds') || []}
                onChange={ids => setValue('assigneeIds', ids)}
              />
              {errors.assigneeIds && (
                <FieldError>{errors.assigneeIds.message}</FieldError>
              )}
            </Field>
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            type='submit'
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
