import { RpcExceptionInterceptor } from '@/shared/interceptors/rpc-exception.interceptor'
import { Controller, UseInterceptors } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CreateCommentPayload, GetCommentsPayload } from '@repo/types'
import { TaskCommentsService } from './task-comments.service'

@Controller()
@UseInterceptors(RpcExceptionInterceptor)
export class TaskCommentsController {
  constructor(private readonly taskCommentsService: TaskCommentsService) {}

  @MessagePattern('create-task-comment')
  async createComment(@Payload() payload: CreateCommentPayload) {
    return await this.taskCommentsService.create(
      payload.taskId,
      payload.createCommentDto,
      payload.userId,
    )
  }

  @MessagePattern('get-task-comments')
  async getComments(@Payload() payload: GetCommentsPayload) {
    return await this.taskCommentsService.findByTaskId(
      payload.taskId,
      payload.page || 1,
      payload.size || 10,
    )
  }
}
