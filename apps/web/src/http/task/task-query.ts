import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { AxiosInstance } from '../axios-instance'
import type { PaginatedResponseDto, PaginationDto } from '../generics'
import type { Task } from './dto/task-dto'

export function TasksQuery(pagination: PaginationDto) {
  return queryOptions<PaginatedResponseDto<Task>>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await AxiosInstance.get<PaginatedResponseDto<Task>>(
        '/tasks',
        {
          params: pagination,
        },
      )
      return response.data
    },
  })
}

export function TaskQuery(id: string) {
  return queryOptions<Task>({
    queryKey: ['task', id],
    queryFn: async () => {
      const response = await AxiosInstance.get<Task>(`/tasks/${id}`)
      return response.data
    },
  })
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await AxiosInstance.delete(`/tasks/${id}`)
    },
    onSuccess: (_, id: string) => {
      queryClient.removeQueries({
        queryKey: ['task', id],
      })

      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      })

      toast.success('Tarefa deletada com sucesso!')
    },
  })
}
