import { useAuthStore } from '@/stores/auth-store'
import { getEnv } from '@/utils/env-manager'
import axios from 'axios'

export const AxiosInstance = axios.create({
  baseURL: getEnv().VITE_API_URL,
})

AxiosInstance.interceptors.request.use(
  config => {
    const { accessToken } = useAuthStore.getState()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

AxiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const { refreshToken } = useAuthStore.getState()

        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await axios.post(
          `${getEnv().VITE_API_URL}/auth/refresh`,
          { refreshToken },
        )

        const { accessToken } = response.data
        useAuthStore.getState().setTokens(accessToken, refreshToken)

        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return AxiosInstance(originalRequest)
      } catch (refreshError) {
        useAuthStore.getState().logout()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)
