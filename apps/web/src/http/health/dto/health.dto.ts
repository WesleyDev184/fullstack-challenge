export interface ServiceHealth {
  status: string
  message: string
}

export interface HealthResponse {
  status: string
  info: Record<string, ServiceHealth>
  error: Record<string, any>
  details: Record<string, ServiceHealth>
}
