import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaginatedResponseDto } from '@repo/types'
import { EntityManager, Repository } from 'typeorm'
import { TaskComment } from '../shared/database/entities/task-comment.entity'

@Injectable()
export class TaskCommentService {
  constructor(
    @InjectRepository(TaskComment)
    private readonly taskCommentRepository: Repository<TaskComment>,
  ) {}

  async create(
    taskId: string,
    authorId: string,
    content: string,
  ): Promise<TaskComment> {
    const comment = this.taskCommentRepository.create({
      taskId,
      authorId,
      content,
    })
    return this.taskCommentRepository.save(comment)
  }

  async createWithManager(
    manager: EntityManager,
    taskId: string,
    authorId: string,
    content: string,
  ): Promise<TaskComment> {
    const comment = manager.create(TaskComment, {
      taskId,
      authorId,
      content,
    })
    return manager.save(comment)
  }

  async findByTaskId(
    taskId: string,
    page: number = 1,
    size: number = 10,
  ): Promise<PaginatedResponseDto<TaskComment>> {
    const [data, total] = await this.taskCommentRepository.findAndCount({
      where: { taskId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * size,
      take: size,
    })

    return new PaginatedResponseDto(data, page, size, total)
  }
}
