import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Repository } from 'typeorm'
import { TaskHistory } from '../shared/database/entities/task-history.entity'

@Injectable()
export class TaskHistoryService {
  constructor(
    @InjectRepository(TaskHistory)
    private readonly taskHistoryRepository: Repository<TaskHistory>,
  ) {}

  async create(
    taskId: string,
    actorId: string | null,
    change: string,
    metadata?: Record<string, any>,
  ): Promise<TaskHistory> {
    const history = this.taskHistoryRepository.create({
      taskId,
      actorId: actorId ?? undefined,
      change,
      metadata,
    })
    return this.taskHistoryRepository.save(history)
  }

  async createWithManager(
    manager: EntityManager,
    taskId: string,
    actorId: string | null,
    change: string,
    metadata?: Record<string, any>,
  ): Promise<TaskHistory> {
    const history = manager.create(TaskHistory, {
      taskId,
      actorId: actorId ?? undefined,
      change,
      metadata,
    })
    return manager.save(history)
  }

  async findByTaskId(taskId: string): Promise<TaskHistory[]> {
    return this.taskHistoryRepository.find({
      where: { taskId },
      order: { createdAt: 'DESC' },
    })
  }
}
