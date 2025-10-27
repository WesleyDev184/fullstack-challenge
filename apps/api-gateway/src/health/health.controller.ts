import { Controller, Get, Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
} from '@nestjs/terminus'
import {
  AUTH_SERVICE_NAME,
  NOTIFICATIONS_SERVICE_NAME,
  TASKS_SERVICE_NAME,
} from '@repo/consts'
import { catchError, lastValueFrom, map, of, timeout } from 'rxjs'

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    @Inject(AUTH_SERVICE_NAME) private authClient: ClientProxy,
    @Inject(TASKS_SERVICE_NAME) private tasksClient: ClientProxy,
    @Inject(NOTIFICATIONS_SERVICE_NAME)
    private notificationsClient: ClientProxy,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Verifica o status de saúde de todos os serviços' })
  @ApiResponse({
    status: 200,
    description: 'Serviços saudáveis',
  })
  @ApiResponse({
    status: 503,
    description: 'Um ou mais serviços não estão saudáveis',
  })
  async check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.checkAuthService(),
      () => this.checkTasksService(),
      () => this.checkNotificationsService(),
    ])
  }

  @Get('auth')
  @HealthCheck()
  @ApiOperation({ summary: 'Verifica o status do serviço de autenticação' })
  @ApiResponse({
    status: 200,
    description: 'Serviço de autenticação saudável',
  })
  @ApiResponse({
    status: 503,
    description: 'Serviço de autenticação não está saudável',
  })
  async checkAuth(): Promise<HealthCheckResult> {
    return this.health.check([() => this.checkAuthService()])
  }

  @Get('tasks')
  @HealthCheck()
  @ApiOperation({ summary: 'Verifica o status do serviço de tarefas' })
  @ApiResponse({
    status: 200,
    description: 'Serviço de tarefas saudável',
  })
  @ApiResponse({
    status: 503,
    description: 'Serviço de tarefas não está saudável',
  })
  async checkTasks(): Promise<HealthCheckResult> {
    return this.health.check([() => this.checkTasksService()])
  }

  @Get('notifications')
  @HealthCheck()
  @ApiOperation({ summary: 'Verifica o status do serviço de notificações' })
  @ApiResponse({
    status: 200,
    description: 'Serviço de notificações saudável',
  })
  @ApiResponse({
    status: 503,
    description: 'Serviço de notificações não está saudável',
  })
  async checkNotifications(): Promise<HealthCheckResult> {
    return this.health.check([() => this.checkNotificationsService()])
  }

  private async checkAuthService(): Promise<HealthIndicatorResult> {
    const serviceName = 'auth-service'
    try {
      const result = await lastValueFrom(
        this.authClient.send({ cmd: 'health' }, {}).pipe(
          timeout(5000),
          map(() => ({
            [serviceName]: {
              status: 'up' as const,
              message: 'Auth service is responding',
            },
          })),
          catchError((error: Error) =>
            of({
              [serviceName]: {
                status: 'down' as const,
                message: error?.message || 'Auth service is not responding',
              },
            }),
          ),
        ),
      )

      return (
        result ?? {
          [serviceName]: {
            status: 'down' as const,
            message: 'Auth service is not responding',
          },
        }
      )
    } catch (error) {
      const err = error as Error
      return {
        [serviceName]: {
          status: 'down' as const,
          message: err?.message || 'Auth service is not responding',
        },
      }
    }
  }

  private async checkTasksService(): Promise<HealthIndicatorResult> {
    const serviceName = 'tasks-service'
    try {
      const result = await lastValueFrom(
        this.tasksClient.send({ cmd: 'health' }, {}).pipe(
          timeout(5000),
          map(() => ({
            [serviceName]: {
              status: 'up' as const,
              message: 'Tasks service is responding',
            },
          })),
          catchError((error: Error) =>
            of({
              [serviceName]: {
                status: 'down' as const,
                message: error?.message || 'Tasks service is not responding',
              },
            }),
          ),
        ),
      )

      return (
        result ?? {
          [serviceName]: {
            status: 'down' as const,
            message: 'Tasks service is not responding',
          },
        }
      )
    } catch (error) {
      const err = error as Error
      return {
        [serviceName]: {
          status: 'down' as const,
          message: err?.message || 'Tasks service is not responding',
        },
      }
    }
  }

  private async checkNotificationsService(): Promise<HealthIndicatorResult> {
    const serviceName = 'notifications-service'
    try {
      const result = await lastValueFrom(
        this.notificationsClient.send({ cmd: 'health' }, {}).pipe(
          timeout(5000),
          map(() => ({
            [serviceName]: {
              status: 'up' as const,
              message: 'Notifications service is responding',
            },
          })),
          catchError((error: Error) =>
            of({
              [serviceName]: {
                status: 'down' as const,
                message:
                  error?.message || 'Notifications service is not responding',
              },
            }),
          ),
        ),
      )

      return (
        result ?? {
          [serviceName]: {
            status: 'down' as const,
            message: 'Notifications service is not responding',
          },
        }
      )
    } catch (error) {
      const err = error as Error
      return {
        [serviceName]: {
          status: 'down' as const,
          message: err?.message || 'Notifications service is not responding',
        },
      }
    }
  }
}
