import { RpcExceptionInterceptor } from '@/shared/interceptors/rpc-exception.interceptor'
import { Controller, HttpException, UseInterceptors } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import {
  CreateCommentPayload,
  CreateTaskPayload,
  FindAllTasksPayload,
  GetCommentsPayload,
  RemoveTaskPayload,
  UpdateTaskPayload,
} from '@repo/types'
import { TasksService } from './tasks.service'

@Controller()
@UseInterceptors(RpcExceptionInterceptor)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @MessagePattern('find-all-tasks')
  async findAll(@Payload() payload: FindAllTasksPayload) {
    return await this.tasksService.findAll(
      payload.page || 1,
      payload.size || 10,
    )
  }

  @MessagePattern('create-task')
  async create(@Payload() payload: CreateTaskPayload) {
    return await this.tasksService.create(payload.createTaskDto, payload.userId)
  }

  @MessagePattern('find-task-by-id')
  async findOne(@Payload() id: string) {
    return await this.tasksService.findOne(id)
  }

  @MessagePattern('update-task')
  async update(@Payload() payload: UpdateTaskPayload) {
    if (!payload.id) {
      throw new HttpException('Task ID is required for update', 400)
    }

    return await this.tasksService.update(
      payload.id,
      payload.updateTaskDto,
      payload.userId,
    )
  }

  @MessagePattern('remove-task')
  async remove(@Payload() payload: RemoveTaskPayload) {
    await this.tasksService.remove(payload.id, payload.userId)
    return { message: 'Task deleted successfully' }
  }

  @MessagePattern('create-task-comment')
  async createComment(@Payload() payload: CreateCommentPayload) {
    return await this.tasksService.createComment(
      payload.taskId,
      payload.createCommentDto,
      payload.userId,
    )
  }

  @MessagePattern('get-task-comments')
  async getComments(@Payload() payload: GetCommentsPayload) {
    return await this.tasksService.getComments(
      payload.taskId,
      payload.page || 1,
      payload.size || 10,
    )
  }
}
