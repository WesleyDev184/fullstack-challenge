import { getEnv } from '@/utils/env-manager'
import { queryOptions } from '@tanstack/react-query'
import axios from 'axios'
import type { HealthResponse } from './dto/health.dto'

export function HealthServiceQuery() {
  return queryOptions<HealthResponse>({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await axios.get<HealthResponse>(
        `${getEnv().VITE_API_URL}/health`,
      )
      return response.data
    },
  })
}
