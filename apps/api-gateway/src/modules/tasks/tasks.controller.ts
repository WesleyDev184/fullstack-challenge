import { AuthGuard } from '@/guards/auth/auth.guard'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
  Put,
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
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({
    status: 201,
    description: 'Tarefa criada com sucesso',
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
  })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não encontrada',
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

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar uma tarefa' })
  @ApiParam({ name: 'id', description: 'ID da tarefa' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({
    status: 200,
    description: 'Tarefa atualizada com sucesso',
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
  @ApiBody({ type: CreateTaskCommentDto })
  @ApiResponse({
    status: 201,
    description: 'Comentário criado com sucesso',
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
