import { TaskComment } from '@/shared/database/entities/task-comment.entity'
import { Task } from '@/shared/database/entities/task.entity'
import { HttpException, Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { InjectRepository } from '@nestjs/typeorm'
import { NOTIFICATIONS_SERVICE_NAME } from '@repo/consts'
import { CreateTaskCommentDto, PaginatedResponseDto } from '@repo/types'
import { EntityManager, Repository } from 'typeorm'
import { TaskHistoryService } from '../tasks/task-history.service'

@Injectable()
export class TaskCommentsService {
  constructor(
    @InjectRepository(TaskComment)
    private readonly taskCommentRepository: Repository<TaskComment>,
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @Inject(NOTIFICATIONS_SERVICE_NAME)
    private readonly notificationsClient: ClientProxy,
    private readonly entityManager: EntityManager,
    private readonly taskHistoryService: TaskHistoryService,
  ) {}

  async create(
    taskId: string,
    createCommentDto: CreateTaskCommentDto,
    userId: string,
  ): Promise<TaskComment> {
    return await this.entityManager.transaction(async manager => {
      // Verificar se a task existe
      const task = await manager.findOne(Task, { where: { id: taskId } })
      if (!task) {
        throw new HttpException(`Task with ID ${taskId} not found`, 404)
      }

      const comment = await this.createWithManager(
        manager,
        taskId,
        userId,
        createCommentDto.content,
      )

      // Registrar histórico
      await this.taskHistoryService.createWithManager(
        manager,
        taskId,
        userId,
        'Comment added',
        { commentId: comment.id },
      )

      // Publicar evento (fora da transação)
      this.notificationsClient.emit('task.comment.created', {
        taskId,
        commentId: comment.id,
        authorId: userId,
        content: comment.content,
      })

      return comment
    })
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
    // Verificar se a task existe
    const task = await this.tasksRepository.findOne({ where: { id: taskId } })
    if (!task) {
      throw new HttpException(`Task with ID ${taskId} not found`, 404)
    }

    const [data, total] = await this.taskCommentRepository.findAndCount({
      where: { taskId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * size,
      take: size,
    })

    return new PaginatedResponseDto(data, page, size, total)
  }
}
