import { AxiosInstance } from '@/http/axios-instance'
import { getEnv } from '@/utils/env-manager'
import { queryOptions, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import type { PaginatedResponseDto, PaginationDto } from '../generics'
import type {
  AuthResponse,
  LoginFormData,
  RefreshRequest,
  RegisterFormData,
  User,
} from './dto/auth.dto'

export function useLoginMutation() {
  return useMutation<AuthResponse, Error, LoginFormData>({
    mutationFn: async (credentials: LoginFormData) => {
      const response = await axios.post<AuthResponse>(
        `${getEnv().VITE_API_URL}/auth/login`,
        credentials,
      )
      return response.data
    },
  })
}

export function useRefreshTokenMutation() {
  return useMutation<AuthResponse, Error, RefreshRequest>({
    mutationFn: async (data: RefreshRequest) => {
      const response = await axios.post<AuthResponse>(
        `${getEnv().VITE_API_URL}/auth/refresh`,
        data,
      )
      return response.data
    },
  })
}

export function useRegisterMutation() {
  return useMutation<User, Error, RegisterFormData>({
    mutationFn: async (data: RegisterFormData) => {
      const res = await AxiosInstance.post<User>(`/auth/register`, data)
      return res.data
    },
  })
}

export function UserQuery(userId: string | null) {
  return {
    queryKey: ['user', userId],
    queryFn: async () => {
      if (!userId) {
        return null
      }
      const response = await AxiosInstance.get<User>(`/auth/users/${userId}`)
      return response.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  } as const
}

export function UsersQuery(pagination: PaginationDto) {
  return queryOptions<PaginatedResponseDto<User>>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await AxiosInstance.get<PaginatedResponseDto<User>>(
        '/auth/users',
        {
          params: pagination,
        },
      )
      return response.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

export function EmailsQuery(userIds: string[]) {
  return queryOptions<Record<string, string>>({
    queryKey: ['emails', userIds],
    queryFn: async () => {
      const response = await AxiosInstance.post<{ emails: string[] }>(
        '/auth/users/emails',
        {
          userIds,
        },
      )
      // Criar um mapa de userId -> email mantendo a ordem
      const emailMap: Record<string, string> = {}
      userIds.forEach((userId, index) => {
        emailMap[userId] = response.data.emails[index]
      })
      return emailMap
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}
