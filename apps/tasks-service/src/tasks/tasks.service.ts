import { Task } from '@/shared/database/entities/task.entity'
import { HttpException, Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { InjectRepository } from '@nestjs/typeorm'
import { AUTH_SERVICE_NAME, NOTIFICATIONS_SERVICE_NAME } from '@repo/consts'
import {
  CreateNotificationDto,
  CreateTaskDto,
  NotificationCategoryEnum,
  PaginatedResponseDto,
  UpdateTaskDto,
} from '@repo/types'
import { lastValueFrom } from 'rxjs'
import { EntityManager, Repository } from 'typeorm'
import { TaskAssigneeService } from './task-assignee.service'
import { TaskHistoryService } from './task-history.service'

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @Inject(NOTIFICATIONS_SERVICE_NAME)
    private readonly notificationsClient: ClientProxy,
    @Inject(AUTH_SERVICE_NAME)
    private readonly authClient: ClientProxy,
    private readonly entityManager: EntityManager,
    private readonly taskHistoryService: TaskHistoryService,
    private readonly taskAssigneeService: TaskAssigneeService,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    return await this.entityManager.transaction(async manager => {
      const { assigneeIds, ...taskData } = createTaskDto

      if (assigneeIds && assigneeIds.length > 0) {
        const validAssigneeIds = await lastValueFrom(
          this.authClient.send<string[], string[]>(
            'validate-users',
            assigneeIds || [],
          ),
        )

        const invalidAssigneeIds = validAssigneeIds.filter(id =>
          assigneeIds.includes(id),
        )

        if (invalidAssigneeIds.length !== assigneeIds.length) {
          throw new HttpException(
            `Some assignee IDs are invalid: ${assigneeIds
              .filter(id => !validAssigneeIds.includes(id))
              .join(', ')}`,
            400,
          )
        }
      }

      const task = this.tasksRepository.create({
        ...taskData,
        createdBy: userId,
      })

      const savedTask = await manager.save(task)

      // Atribuir usuários, se fornecidos
      if (assigneeIds && assigneeIds.length > 0) {
        await this.taskAssigneeService.assignUsersWithManager(
          manager,
          savedTask.id,
          assigneeIds,
        )
      }

      // Registrar histórico
      await this.taskHistoryService.createWithManager(
        manager,
        savedTask.id,
        userId,
        'Task created',
        { title: savedTask.title },
      )

      // Publicar evento (fora da transação)
      this.notificationsClient.emit(
        'create.notification',
        new CreateNotificationDto(
          'Task Created',
          savedTask.id,
          `The task "${task.title}" has been updated.`,
          NotificationCategoryEnum.ASSIGNMENT,
          assigneeIds ? [userId, ...assigneeIds] : [],
        ),
      )

      return savedTask
    })
  }

  async findAll(
    page: number = 1,
    size: number = 10,
  ): Promise<PaginatedResponseDto<Task>> {
    const [data, total] = await this.tasksRepository.findAndCount({
      relations: ['assignees'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * size,
      take: size,
    })

    return new PaginatedResponseDto(data, page, size, total)
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['assignees', 'comments', 'history'],
    })

    if (!task) {
      throw new HttpException(`Task with ID ${id} not found`, 404)
    }

    return task
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    return await this.entityManager.transaction(async manager => {
      const task = await this.tasksRepository.findOne({ where: { id } })

      if (!task) {
        throw new HttpException(`Task with ID ${id} not found`, 404)
      }

      const assigneeIds = updateTaskDto.assigneeIds ?? []

      if (assigneeIds.length > 0) {
        const validAssigneeIds = await lastValueFrom(
          this.authClient.send<string[], string[]>(
            'validate-users',
            assigneeIds,
          ),
        )

        const invalidAssigneeIds = validAssigneeIds.filter(id =>
          assigneeIds.includes(id),
        )

        if (invalidAssigneeIds.length !== assigneeIds.length) {
          throw new HttpException(
            `Some assignee IDs are invalid: ${assigneeIds
              .filter(id => !validAssigneeIds.includes(id))
              .join(', ')}`,
            400,
          )
        }
      }

      // Detectar mudanças para o histórico
      const changes: Record<string, any> = {}

      if (
        updateTaskDto.title !== undefined &&
        task.title !== updateTaskDto.title
      ) {
        changes.title = { from: task.title, to: updateTaskDto.title }
        task.title = updateTaskDto.title
      }
      if (
        updateTaskDto.description !== undefined &&
        task.description !== updateTaskDto.description
      ) {
        changes.description = {
          from: task.description,
          to: updateTaskDto.description,
        }
        task.description = updateTaskDto.description
      }
      if (
        updateTaskDto.dueAt !== undefined &&
        task.dueAt !== updateTaskDto.dueAt
      ) {
        changes.dueAt = { from: task.dueAt, to: updateTaskDto.dueAt }
        task.dueAt = updateTaskDto.dueAt
      }
      if (
        updateTaskDto.priority !== undefined &&
        task.priority !== updateTaskDto.priority
      ) {
        changes.priority = { from: task.priority, to: updateTaskDto.priority }
        task.priority = updateTaskDto.priority
      }
      if (
        updateTaskDto.status !== undefined &&
        task.status !== updateTaskDto.status
      ) {
        changes.status = { from: task.status, to: updateTaskDto.status }
        task.status = updateTaskDto.status
      }

      await manager.save(task)

      // Atualizar assignees
      if (assigneeIds !== undefined) {
        await this.taskAssigneeService.updateAssigneesWithManager(
          manager,
          id,
          assigneeIds,
        )
        changes['assignees'] = { updated: true }
      }

      // Registrar histórico
      if (Object.keys(changes).length > 0) {
        await this.taskHistoryService.createWithManager(
          manager,
          id,
          userId,
          'Task updated',
          changes,
        )
      }

      // Publicar evento (fora da transação)
      this.notificationsClient.emit(
        'create.notification',
        new CreateNotificationDto(
          'Task Updated',
          task.id,
          `The task "${task.title}" has been updated.`,
          NotificationCategoryEnum.ASSIGNMENT,
          assigneeIds ? [userId, ...assigneeIds] : [],
        ),
      )

      return task
    })
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.entityManager.transaction(async manager => {
      const task = await this.tasksRepository.findOne({ where: { id } })

      if (!task) {
        throw new HttpException(`Task with ID ${id} not found`, 404)
      }

      await this.taskHistoryService.createWithManager(
        manager,
        id,
        userId,
        'Task deleted',
        { title: task.title },
      )

      await manager.remove(task)
    })
  }
}
