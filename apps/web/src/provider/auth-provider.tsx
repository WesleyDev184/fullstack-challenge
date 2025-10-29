import {
  useLoginMutation,
  useRefreshTokenMutation,
  useUserQuery,
} from '@/http/auth/auth.query'
import type { LoginRequest, User } from '@/http/auth/dto/auth.dto'
import type { ReactNode } from 'react'
import React, { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
  refreshAccessToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

function decodeJWT(token: string): any {
  const payload = token.split('.')[1]
  const decoded = JSON.parse(
    atob(payload.replace(/-/g, '+').replace(/_/g, '/')),
  )
  return decoded
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const loginMutation = useLoginMutation()
  const refreshMutation = useRefreshTokenMutation()
  const { data: fetchedUser } = useUserQuery(userId, accessToken || undefined)

  // Update user when fetched
  useEffect(() => {
    if (fetchedUser) {
      setUser(fetchedUser)
    }
  }, [fetchedUser])

  useEffect(() => {
    // Load tokens from localStorage on mount
    const storedAccessToken = localStorage.getItem('accessToken')
    const storedRefreshToken = localStorage.getItem('refreshToken')

    if (storedAccessToken) {
      setAccessToken(storedAccessToken)
      // Decode to get userId
      const decoded = decodeJWT(storedAccessToken)
      const id = decoded.sub || decoded.userId
      setUserId(id)
    }
    if (storedRefreshToken) {
      setRefreshToken(storedRefreshToken)
    }
  }, [])

  const login = async (credentials: LoginRequest) => {
    const data = await loginMutation.mutateAsync(credentials)

    setAccessToken(data.accessToken)
    setRefreshToken(data.refreshToken)

    // Persist tokens to localStorage
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)

    // Decode token to get user ID
    const decoded = decodeJWT(data.accessToken)
    const id = decoded.sub || decoded.userId
    setUserId(id)
  }

  const logout = () => {
    setUser(null)
    setAccessToken(null)
    setRefreshToken(null)
    setUserId(null)

    // Clear localStorage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  const refreshAccessToken = async () => {
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const data = await refreshMutation.mutateAsync({ refreshToken })

    setAccessToken(data.accessToken)

    // Update localStorage
    localStorage.setItem('accessToken', data.accessToken)
  }

  const value: AuthContextType = {
    user,
    accessToken,
    refreshToken,
    login,
    logout,
    refreshAccessToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
