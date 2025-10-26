import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Repository } from 'typeorm'
import { TaskAssignee } from '../shared/database/entities/task-assignee.entity'

@Injectable()
export class TaskAssigneeService {
  constructor(
    @InjectRepository(TaskAssignee)
    private readonly taskAssigneeRepository: Repository<TaskAssignee>,
  ) {}

  async assignUsers(taskId: string, userIds: string[]): Promise<void> {
    const assignees = userIds.map(userId =>
      this.taskAssigneeRepository.create({ taskId, userId }),
    )
    await this.taskAssigneeRepository.save(assignees)
  }

  async assignUsersWithManager(
    manager: EntityManager,
    taskId: string,
    userIds: string[],
  ): Promise<void> {
    const assignees = userIds.map(userId =>
      manager.create(TaskAssignee, { taskId, userId }),
    )
    await manager.save(assignees)
  }

  async removeAssignees(taskId: string): Promise<void> {
    await this.taskAssigneeRepository.delete({ taskId })
  }

  async removeAssigneesWithManager(
    manager: EntityManager,
    taskId: string,
  ): Promise<void> {
    await manager.delete(TaskAssignee, { taskId })
  }

  async updateAssignees(taskId: string, userIds: string[]): Promise<void> {
    await this.removeAssignees(taskId)
    if (userIds && userIds.length > 0) {
      await this.assignUsers(taskId, userIds)
    }
  }

  async updateAssigneesWithManager(
    manager: EntityManager,
    taskId: string,
    userIds: string[],
  ): Promise<void> {
    await this.removeAssigneesWithManager(manager, taskId)
    if (userIds && userIds.length > 0) {
      await this.assignUsersWithManager(manager, taskId, userIds)
    }
  }
}
