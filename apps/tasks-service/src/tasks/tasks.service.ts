import { Task } from '@/shared/database/entities/task.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateTaskDto, UpdateTaskDto } from '@repo/types'
import { EntityManager, Repository } from 'typeorm'

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    private readonly entityManager: EntityManager,
  ) {}

  create(createTaskDto: CreateTaskDto) {
    return 'This action adds a new task'
  }

  findAll() {
    return `This action returns all tasks`
  }

  findOne(id: string) {
    return `This action returns a #${id} task`
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`
  }

  remove(id: string) {
    return `This action removes a #${id} task`
  }
}
