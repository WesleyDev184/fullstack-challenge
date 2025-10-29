import { getEnv } from '@/utils/env-manager'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type {
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  RefreshResponse,
  User,
} from './dto/auth.dto'

export function useLoginMutation() {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (credentials: LoginRequest) => {
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

export function useUserQuery(userId: string | null, accessToken?: string) {
  return useQuery<User>({
    queryKey: ['user', userId],
    queryFn: async () => {
      console.log('Fetching user with ID:', userId)
      const response = await axios.get<User>(
        `${getEnv().VITE_API_URL}/auth/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      return response.data
    },
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}
