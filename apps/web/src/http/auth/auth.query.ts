import { AxiosInstance } from '@/http/axios-instance'
import { getEnv } from '@/utils/env-manager'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type {
  LoginFormData,
  LoginResponse,
  RefreshRequest,
  RefreshResponse,
  RegisterFormData,
  User,
} from './dto/auth.dto'

export function useLoginMutation() {
  return useMutation<LoginResponse, Error, LoginFormData>({
    mutationFn: async (credentials: LoginFormData) => {
      const response = await axios.post<LoginResponse>(
        `${getEnv().VITE_API_URL}/auth/login`,
        credentials,
      )
      return response.data
    },
  })
}

export function useRefreshTokenMutation() {
  return useMutation<RefreshResponse, Error, RefreshRequest>({
    mutationFn: async (data: RefreshRequest) => {
      const response = await axios.post<RefreshResponse>(
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

export function useUserQuery(userId: string | null) {
  return useQuery<User>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await AxiosInstance.get<User>(`/auth/users/${userId}`)
      return response.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}
