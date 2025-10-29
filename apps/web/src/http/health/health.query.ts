import { getEnv } from '@/utils/env-manager'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { HealthResponse } from './dto/health.dto'

export function HealthServiceQuery() {
  const res = useQuery<HealthResponse>({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await axios.get<HealthResponse>(
        `${getEnv().VITE_API_URL}/health`,
      )
      return response.data
    },
  })

  return res
}
