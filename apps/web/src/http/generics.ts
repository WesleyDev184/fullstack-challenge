export interface PaginationDto {
  page?: number
  size?: number
}

export interface PaginatedResponseDto<T> {
  page: number
  size: number
  total: number
  totalPages: number
  data: T[]
}

export interface FindAllUsersPayload {
  page?: number
  size?: number
  search?: string
}

export interface GetCommentsPayload {
  taskId: string
  page?: number
  size?: number
}
