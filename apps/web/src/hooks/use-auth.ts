import {
  useLoginMutation,
  useRefreshTokenMutation,
  useRegisterMutation,
  useUserQuery,
} from '@/http/auth/auth.query'
import type { LoginFormData, RegisterFormData } from '@/http/auth/dto/auth.dto'
import { useAuthStore } from '@/stores/auth-store'
import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const useAuth = () => {
  const accessToken = useAuthStore(state => state.accessToken)
  const refreshToken = useAuthStore(state => state.refreshToken)
  const userId = useAuthStore(state => state.userId)
  const user = useAuthStore(state => state.user)
  const setTokens = useAuthStore(state => state.setTokens)
  const setUser = useAuthStore(state => state.setUser)
  const logoutStore = useAuthStore(state => state.logout)

  const loginMutation = useLoginMutation()
  const refreshMutation = useRefreshTokenMutation()
  const registerMutation = useRegisterMutation()
  const { data: fetchedUser, refetch: refetchUser } = useUserQuery(userId)

  const navigate = useNavigate()

  // Sincroniza o usuário quando for buscado
  useEffect(() => {
    if (fetchedUser) {
      setUser(fetchedUser)
    }
  }, [fetchedUser, accessToken])

  const login = async (credentials: LoginFormData) => {
    const data = await loginMutation.mutateAsync(credentials)
    setTokens(data.accessToken, data.refreshToken)

    navigate({
      to: '/',
    })
    return data
  }

  const logout = () => {
    logoutStore()
  }

  const register = async (data: RegisterFormData) => {
    await registerMutation.mutateAsync(data)
    navigate({
      to: '/auth/login',
      search: {
        postRegister: 'true',
      },
    })
  }

  const refreshAccessToken = async () => {
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const data = await refreshMutation.mutateAsync({ refreshToken })
    setTokens(data.accessToken, refreshToken)
    return data
  }

  const fetchUser = async () => {
    if (userId && !user) {
      const result = await refetchUser()
      return result.data || null
    }
    return user
  }

  const isAuthenticated = !!accessToken && !!userId

  return {
    user,
    userId,
    isAuthenticated,
    login,
    logout,
    register,
    fetchUser,
    refreshAccessToken,
  }
}
