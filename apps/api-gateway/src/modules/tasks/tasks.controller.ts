import { AuthGuard } from '@/guards/auth/auth.guard'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { TASKS_SERVICE_NAME } from '@repo/consts'
import {
  CreateTaskCommentDto,
  CreateTaskDto,
  PaginationDto,
  UpdateTaskDto,
} from '@repo/types'
import { catchError, lastValueFrom, throwError } from 'rxjs'

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(
    @Inject(TASKS_SERVICE_NAME) private readonly tasksService: ClientProxy,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas as tarefas com paginação' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página (padrão: 1)',
  })
  @ApiQuery({
    name: 'size',
    required: false,
    type: Number,
    description: 'Itens por página (padrão: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tarefas retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        page: { type: 'number', example: 1 },
        size: { type: 'number', example: 1 },
        total: { type: 'number', example: 6 },
        totalPages: { type: 'number', example: 6 },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                example: '2dd1fd92-bcc2-43a5-bbc4-46d341c4814a',
              },
              title: { type: 'string', example: 'Auth logic' },
              description: {
                type: 'string',
                example:
                  'Adicionar suporte para autenticação baseada em tokens JWT no serviço de tarefas',
              },
              dueAt: {
                type: 'string',
                format: 'date-time',
                example: '2025-11-01T10:00:00.000Z',
              },
              priority: { type: 'string', example: 'HIGH' },
              status: { type: 'string', example: 'TODO' },
              createdBy: {
                type: 'string',
                format: 'uuid',
                example: 'b1f11cdd-de41-4f08-bb2e-e1de8df2b887',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2025-10-26T06:25:28.189Z',
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                example: '2025-10-26T06:25:33.982Z',
              },
              assignees: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    taskId: {
                      type: 'string',
                      format: 'uuid',
                      example: 'd2a0604f-cdad-4d15-877b-d5dfd027622e',
                    },
                    userId: {
                      type: 'string',
                      format: 'uuid',
                      example: 'd378a5d9-0b5b-423f-b16d-bbc46c25b321',
                    },
                    assignedAt: {
                      type: 'string',
                      format: 'date-time',
                      example: '2025-10-26T06:18:58.142Z',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid token' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T07:16:00.803Z',
        },
        path: { type: 'string', example: '/api/tasks' },
      },
    },
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await lastValueFrom(
      this.tasksService
        .send('find-all-tasks', {
          page: paginationDto.page || 1,
          size: paginationDto.size || 10,
        })
        .pipe(
          catchError(error => {
            return throwError(
              () => new HttpException(error.message, error.status || 500),
            )
          }),
        ),
    )
    return result
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar uma nova tarefa' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title'],
      properties: {
        title: {
          type: 'string',
          minLength: 3,
          description: 'Título da tarefa (obrigatório, mínimo 3 caracteres)',
          example: 'Teste',
        },
        description: {
          type: 'string',
          description: 'Descrição da tarefa (opcional, pode ser null)',
          example:
            'Adicionar suporte para autenticação baseada em tokens JWT no serviço de tarefas',
        },
        dueAt: {
          type: 'string',
          format: 'date-time',
          description: 'Data de vencimento da tarefa (opcional, pode ser null)',
          example: '2025-11-01T10:00:00.000Z',
        },
        priority: {
          type: 'string',
          enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
          description: 'Prioridade da tarefa (opcional, pode ser null)',
          example: 'HIGH',
        },
        status: {
          type: 'string',
          enum: ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'],
          description: 'Status da tarefa (opcional, pode ser null)',
          example: 'TODO',
        },
        assigneeIds: {
          type: 'array',
          items: {
            type: 'string',
            format: 'uuid',
          },
          nullable: true,
          description:
            'IDs dos usuários atribuídos à tarefa (opcional, pode ser null)',
          example: [
            'd378a5d9-0b5b-423f-b16d-bbc46c25b321',
            'b9ee2ed0-7ed2-4a29-9135-a5ef02dffb32',
          ],
        },
      },
    },
    examples: {
      'create-task': {
        summary: 'Exemplo de criação de tarefa',
        value: {
          title: 'Teste',
          description:
            'Adicionar suporte para autenticação baseada em tokens JWT no serviço de tarefas',
          dueAt: '2025-11-01T10:00:00.000Z',
          priority: 'HIGH',
          status: 'TODO',
          assigneeIds: [
            'd378a5d9-0b5b-423f-b16d-bbc46c25b321',
            'b9ee2ed0-7ed2-4a29-9135-a5ef02dffb32',
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Tarefa criada com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          example: '2dd1fd92-bcc2-43a5-bbc4-46d341c4814a',
        },
        title: { type: 'string', example: 'Teste' },
        description: {
          type: 'string',
          example:
            'Adicionar suporte para autenticação baseada em tokens JWT no serviço de tarefas',
        },
        dueAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-11-01T10:00:00.000Z',
        },
        priority: { type: 'string', example: 'HIGH' },
        status: { type: 'string', example: 'TODO' },
        createdBy: {
          type: 'string',
          format: 'uuid',
          example: 'b1f11cdd-de41-4f08-bb2e-e1de8df2b887',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T06:25:28.189Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T06:25:28.189Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Requisição inválida',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Some assignee IDs are invalid' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T07:16:00.803Z',
        },
        path: { type: 'string', example: '/api/tasks' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid token' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T07:16:00.803Z',
        },
        path: { type: 'string', example: '/api/tasks' },
      },
    },
  })
  async create(@Body() createTaskDto: CreateTaskDto, @Request() req: any) {
    const userId = req.user?.id || 'system'
    const result = await lastValueFrom(
      this.tasksService.send('create-task', { createTaskDto, userId }).pipe(
        catchError(error => {
          return throwError(
            () => new HttpException(error.message, error.status || 500),
          )
        }),
      ),
    )
    return result
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar uma tarefa por ID' })
  @ApiParam({ name: 'id', description: 'ID da tarefa' })
  @ApiResponse({
    status: 200,
    description: 'Tarefa encontrada com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          example: '2dd1fd92-bcc2-43a5-bbc4-46d341c4814a',
        },
        title: { type: 'string', example: 'Auth logic' },
        description: {
          type: 'string',
          example:
            'Adicionar suporte para autenticação baseada em tokens JWT no serviço de tarefas',
        },
        dueAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-11-01T10:00:00.000Z',
        },
        priority: { type: 'string', example: 'HIGH' },
        status: { type: 'string', example: 'TODO' },
        createdBy: {
          type: 'string',
          format: 'uuid',
          example: 'b1f11cdd-de41-4f08-bb2e-e1de8df2b887',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T06:25:28.189Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T06:25:33.982Z',
        },
        assignees: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              taskId: {
                type: 'string',
                format: 'uuid',
                example: 'd2a0604f-cdad-4d15-877b-d5dfd027622e',
              },
              userId: {
                type: 'string',
                format: 'uuid',
                example: 'd378a5d9-0b5b-423f-b16d-bbc46c25b321',
              },
              assignedAt: {
                type: 'string',
                format: 'date-time',
                example: '2025-10-26T06:18:58.142Z',
              },
            },
          },
        },
        comments: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                example: 'b6262c85-8dfe-4ef3-bce8-1057e8aecc50',
              },
              taskId: {
                type: 'string',
                format: 'uuid',
                example: '2dd1fd92-bcc2-43a5-bbc4-46d341c4814a',
              },
              authorId: {
                type: 'string',
                format: 'uuid',
                example: 'b1f11cdd-de41-4f08-bb2e-e1de8df2b887',
              },
              content: { type: 'string', example: 'teste batata' },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2025-10-26T06:32:47.982Z',
              },
            },
          },
        },
        history: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                example: '65ef792b-ef40-4e7d-804d-e1467798d895',
              },
              taskId: {
                type: 'string',
                format: 'uuid',
                example: '2dd1fd92-bcc2-43a5-bbc4-46d341c4814a',
              },
              actorId: {
                type: 'string',
                format: 'uuid',
                example: 'b1f11cdd-de41-4f08-bb2e-e1de8df2b887',
              },
              change: { type: 'string', example: 'Task created' },
              metadata: {
                type: 'object',
                example: { title: 'Teste' },
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2025-10-26T06:25:28.189Z',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não encontrada',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Tarefa não encontrada' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T07:16:00.803Z',
        },
        path: { type: 'string', example: '/api/tasks/:id' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid token' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T07:16:00.803Z',
        },
        path: { type: 'string', example: '/api/tasks/:id' },
      },
    },
  })
  async findOne(@Param('id') id: string) {
    const result = await lastValueFrom(
      this.tasksService.send('find-task-by-id', id).pipe(
        catchError(error => {
          return throwError(
            () => new HttpException(error.message, error.status || 500),
          )
        }),
      ),
    )
    return result
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar uma tarefa' })
  @ApiParam({ name: 'id', description: 'ID da tarefa' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          minLength: 3,
          nullable: true,
          description:
            'Título da tarefa (opcional, pode ser null, mínimo 3 caracteres se fornecido)',
          example: 'Teste',
        },
        description: {
          type: 'string',
          nullable: true,
          description: 'Descrição da tarefa (opcional, pode ser null)',
          example:
            'Adicionar suporte para autenticação baseada em tokens JWT no serviço de tarefas',
        },
        dueAt: {
          type: 'string',
          format: 'date-time',
          nullable: true,
          description: 'Data de vencimento da tarefa (opcional, pode ser null)',
          example: '2025-11-01T10:00:00.000Z',
        },
        priority: {
          type: 'string',
          enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
          nullable: true,
          description: 'Prioridade da tarefa (opcional, pode ser null)',
          example: 'HIGH',
        },
        status: {
          type: 'string',
          enum: ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'],
          nullable: true,
          description: 'Status da tarefa (opcional, pode ser null)',
          example: 'TODO',
        },
        assigneeIds: {
          type: 'array',
          items: {
            type: 'string',
            format: 'uuid',
          },
          nullable: true,
          description:
            'IDs dos usuários atribuídos à tarefa (opcional, pode ser null)',
          example: [
            'd378a5d9-0b5b-423f-b16d-bbc46c25b321',
            'b9ee2ed0-7ed2-4a29-9135-a5ef02dffb32',
          ],
        },
      },
    },
    examples: {
      'update-task': {
        summary: 'Exemplo de atualização de tarefa',
        value: {
          title: 'Teste',
          description:
            'Adicionar suporte para autenticação baseada em tokens JWT no serviço de tarefas',
          dueAt: '2025-11-01T10:00:00.000Z',
          priority: 'HIGH',
          status: 'TODO',
          assigneeIds: [
            'd378a5d9-0b5b-423f-b16d-bbc46c25b321',
            'b9ee2ed0-7ed2-4a29-9135-a5ef02dffb32',
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Tarefa atualizada com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          example: '2dd1fd92-bcc2-43a5-bbc4-46d341c4814a',
        },
        title: { type: 'string', example: 'Teste Atualizado' },
        description: {
          type: 'string',
          example:
            'Adicionar suporte para autenticação baseada em tokens JWT no serviço de tarefas',
        },
        dueAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-11-01T10:00:00.000Z',
        },
        priority: { type: 'string', example: 'HIGH' },
        status: { type: 'string', example: 'TODO' },
        createdBy: {
          type: 'string',
          format: 'uuid',
          example: 'b1f11cdd-de41-4f08-bb2e-e1de8df2b887',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T06:25:28.189Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T06:25:28.189Z',
        },
        assignees: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              taskId: {
                type: 'string',
                format: 'uuid',
                example: 'd2a0604f-cdad-4d15-877b-d5dfd027622e',
              },
              userId: {
                type: 'string',
                format: 'uuid',
                example: 'd378a5d9-0b5b-423f-b16d-bbc46c25b321',
              },
              assignedAt: {
                type: 'string',
                format: 'date-time',
                example: '2025-10-26T06:18:58.142Z',
              },
            },
          },
        },
        comments: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                example: 'b6262c85-8dfe-4ef3-bce8-1057e8aecc50',
              },
              taskId: {
                type: 'string',
                format: 'uuid',
                example: '2dd1fd92-bcc2-43a5-bbc4-46d341c4814a',
              },
              authorId: {
                type: 'string',
                format: 'uuid',
                example: 'b1f11cdd-de41-4f08-bb2e-e1de8df2b887',
              },
              content: { type: 'string', example: 'teste batata' },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2025-10-26T06:32:47.982Z',
              },
            },
          },
        },
        history: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                example: '65ef792b-ef40-4e7d-804d-e1467798d895',
              },
              taskId: {
                type: 'string',
                format: 'uuid',
                example: '2dd1fd92-bcc2-43a5-bbc4-46d341c4814a',
              },
              actorId: {
                type: 'string',
                format: 'uuid',
                example: 'b1f11cdd-de41-4f08-bb2e-e1de8df2b887',
              },
              change: { type: 'string', example: 'Task created' },
              metadata: {
                type: 'object',
                example: { title: 'Teste' },
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2025-10-26T06:25:28.189Z',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Requisição inválida',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Some assignee IDs are invalid' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T07:16:00.803Z',
        },
        path: { type: 'string', example: '/api/tasks/:id' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid token' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T07:16:00.803Z',
        },
        path: { type: 'string', example: '/api/tasks/:id' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não encontrada',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Tarefa não encontrada' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T07:16:00.803Z',
        },
        path: { type: 'string', example: '/api/tasks/:id' },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req: any,
  ) {
    const userId = req.user?.id || 'system'
    const result = await lastValueFrom(
      this.tasksService.send('update-task', { id, updateTaskDto, userId }).pipe(
        catchError(error => {
          return throwError(
            () => new HttpException(error.message, error.status || 500),
          )
        }),
      ),
    )
    return result
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar uma tarefa' })
  @ApiParam({ name: 'id', description: 'ID da tarefa' })
  @ApiResponse({
    status: 200,
    description: 'Tarefa deletada com sucesso',
    example: { message: 'Tarefa deletada com sucesso' },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid token' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T07:16:00.803Z',
        },
        path: { type: 'string', example: '/api/tasks/:id' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não encontrada',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Tarefa não encontrada' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T07:16:00.803Z',
        },
        path: { type: 'string', example: '/api/tasks/:id' },
      },
    },
  })
  async remove(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.id || 'system'
    const result = await lastValueFrom(
      this.tasksService.send('remove-task', { id, userId }).pipe(
        catchError(error => {
          return throwError(
            () => new HttpException(error.message, error.status || 500),
          )
        }),
      ),
    )
    return result
  }

  @Post(':id/comments')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adicionar um comentário a uma tarefa' })
  @ApiParam({ name: 'id', description: 'ID da tarefa' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['content'],
      properties: {
        content: {
          type: 'string',
          description: 'Conteúdo do comentário (obrigatório)',
          example: 'teste batata2',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Comentário criado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          example: '61b557b4-ebeb-46d9-b6ad-ccfd0d17d71e',
        },
        taskId: {
          type: 'string',
          format: 'uuid',
          example: '2dd1fd92-bcc2-43a5-bbc4-46d341c4814a',
        },
        authorId: {
          type: 'string',
          format: 'uuid',
          example: 'b1f11cdd-de41-4f08-bb2e-e1de8df2b887',
        },
        content: { type: 'string', example: 'teste batata2' },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T06:33:50.103Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não encontrada',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Tarefa não encontrada' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T07:16:00.803Z',
        },
        path: { type: 'string', example: '/api/tasks/:id/comments' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid token' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T07:16:00.803Z',
        },
        path: { type: 'string', example: '/api/tasks/:id/comments' },
      },
    },
  })
  async createComment(
    @Param('id') taskId: string,
    @Body() createCommentDto: CreateTaskCommentDto,
    @Request() req: any,
  ) {
    const userId = req.user?.id || 'system'
    const result = await lastValueFrom(
      this.tasksService
        .send('create-task-comment', { taskId, createCommentDto, userId })
        .pipe(
          catchError(error => {
            return throwError(
              () => new HttpException(error.message, error.status || 500),
            )
          }),
        ),
    )
    return result
  }

  @Get(':id/comments')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar comentários de uma tarefa' })
  @ApiParam({ name: 'id', description: 'ID da tarefa' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página (padrão: 1)',
  })
  @ApiQuery({
    name: 'size',
    required: false,
    type: Number,
    description: 'Itens por página (padrão: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de comentários retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        page: { type: 'number', example: 1 },
        size: { type: 'number', example: 1 },
        total: { type: 'number', example: 3 },
        totalPages: { type: 'number', example: 3 },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                example: '61b557b4-ebeb-46d9-b6ad-ccfd0d17d71e',
              },
              taskId: {
                type: 'string',
                format: 'uuid',
                example: '2dd1fd92-bcc2-43a5-bbc4-46d341c4814a',
              },
              authorId: {
                type: 'string',
                format: 'uuid',
                example: 'b1f11cdd-de41-4f08-bb2e-e1de8df2b887',
              },
              content: { type: 'string', example: 'teste batata2' },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2025-10-26T06:33:50.103Z',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não encontrada',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Tarefa não encontrada' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T07:16:00.803Z',
        },
        path: { type: 'string', example: '/api/tasks/:id/comments' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid token' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T07:16:00.803Z',
        },
        path: { type: 'string', example: '/api/tasks/:id/comments' },
      },
    },
  })
  async getComments(
    @Param('id') taskId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    const result = await lastValueFrom(
      this.tasksService
        .send('get-task-comments', {
          taskId,
          page: paginationDto.page || 1,
          size: paginationDto.size || 10,
        })
        .pipe(
          catchError(error => {
            return throwError(
              () => new HttpException(error.message, error.status || 500),
            )
          }),
        ),
    )
    return result
  }
}
