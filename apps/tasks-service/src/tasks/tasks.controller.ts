import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CreateTaskDto, HttpError, UpdateTaskDto } from '@repo/types'
import { TasksService } from './tasks.service'

@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @MessagePattern('createTask')
  create(@Payload() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto)
  }

  @MessagePattern('findAllTasks')
  findAll() {
    return this.tasksService.findAll()
  }

  @MessagePattern('findOneTask')
  findOne(@Payload() id: string) {
    return this.tasksService.findOne(id)
  }

  @MessagePattern('updateTask')
  update(@Payload() updateTaskDto: UpdateTaskDto) {
    if (!updateTaskDto.id) {
      return new HttpError('Task ID is required for update', 400)
    }

    return this.tasksService.update(updateTaskDto.id, updateTaskDto)
  }

  @MessagePattern('removeTask')
  remove(@Payload() id: string) {
    return this.tasksService.remove(id)
  }
}
