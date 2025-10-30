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
  UseGuards,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger'
import { AUTH_SERVICE_NAME } from '@repo/consts'
import {
  CreateUserDto,
  FindAllUsersPayload,
  LoginDto,
  UpdateUserDto,
} from '@repo/types'
import { catchError, lastValueFrom, throwError } from 'rxjs'

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE_NAME) private readonly authService: ClientProxy,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar um novo usuário' })
  @ApiBody({
    description: 'Dados necessários para registrar um novo usuário',
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          example: 'johndoe',
          minLength: 3,
          description: 'Nome de usuário único para o novo usuário',
        },
        email: {
          type: 'string',
          format: 'email',
          example: 'johndoe@example.com',
          description: 'Endereço de email único para o novo usuário',
        },
        password: {
          type: 'string',
          example: 'strongpassword123',
          minLength: 8,
          description: 'Senha forte para o novo usuário',
        },
      },
      required: ['username', 'email', 'password'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
        username: { type: 'string', example: 'johndoe' },
        email: {
          type: 'string',
          format: 'email',
          example: 'johndoe@example.com',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-01T00:00:00.000Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-01T00:00:00.000Z',
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
        message: { type: 'string', example: 'Mensagem de erro' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T07:16:00.803Z',
        },
        path: { type: 'string', example: '/api/auth/register' },
      },
    },
  })
  async register(@Body() body: CreateUserDto) {
    const result = await lastValueFrom(
      this.authService.send('create-user', body).pipe(
        catchError(error => {
          return throwError(
            () => new HttpException(error.message, error.status),
          )
        }),
      ),
    )

    return result
  }

  @Post('login')
  @ApiOperation({ summary: 'Fazer login do usuário' })
  @ApiBody({
    description: 'Credenciais para autenticação do usuário',
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'johndoe@example.com',
          description: 'Endereço de email único para o usuário',
        },
        password: {
          type: 'string',
          example: 'strongpassword123',
          minLength: 8,
          description: 'Senha forte para o usuário',
        },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string', example: 'jwt-token-aqui' },
        refreshToken: { type: 'string', example: 'refresh-token-aqui' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Credenciais inválidas' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T07:16:00.803Z',
        },
        path: { type: 'string', example: '/api/auth/login' },
      },
    },
  })
  async login(@Body() body: LoginDto) {
    const result = await lastValueFrom(
      this.authService.send('login', body).pipe(
        catchError(error => {
          return throwError(
            () => new HttpException(error.message, error.status),
          )
        }),
      ),
    )

    return result
  }

  @Post('refresh')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar tokens de autenticação' })
  @ApiBody({
    description: 'Token de refresh para gerar novos tokens de acesso',
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          example: 'refresh-token-aqui',
          description: 'Token de refresh para gerar novos tokens de acesso',
        },
      },
      required: ['refreshToken'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens atualizados com sucesso',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string', example: 'new-jwt-token-aqui' },
        refreshToken: { type: 'string', example: 'new-refresh-token-aqui' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token de atualização inválido',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Token de atualização inválido' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T07:16:00.803Z',
        },
        path: { type: 'string', example: '/api/auth/refresh' },
      },
    },
  })
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    const result = await lastValueFrom(
      this.authService.send('refresh-token', refreshToken).pipe(
        catchError(error => {
          return throwError(
            () => new HttpException(error.message, error.status),
          )
        }),
      ),
    )

    return result
  }

  @Get('users')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter todos os usuários com paginação e busca' })
  @ApiParam({
    name: 'page',
    required: false,
    description: 'Número da página para paginação (inicia em 1)',
    example: 1,
  })
  @ApiParam({
    name: 'size',
    required: false,
    description: 'Quantidade de usuários por página (máximo recomendado: 100)',
    example: 10,
  })
  @ApiParam({
    name: 'search',
    required: false,
    description:
      'Termo de busca para filtrar usuários por username ou email (busca parcial, case-insensitive)',
    example: 'john',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de usuários',
    schema: {
      type: 'object',
      properties: {
        page: { type: 'number', example: 1 },
        size: { type: 'number', example: 10 },
        total: { type: 'number', example: 100 },
        totalPages: { type: 'number', example: 10 },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'uuid',
                example: '550e8400-e29b-41d4-a716-446655440000',
              },
              username: { type: 'string', example: 'johndoe' },
              email: {
                type: 'string',
                format: 'email',
                example: 'johndoe@example.com',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-01T00:00:00.000Z',
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-01T00:00:00.000Z',
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
        message: { type: 'string', example: 'Não autorizado' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T07:16:00.803Z',
        },
        path: { type: 'string', example: '/api/auth/users' },
      },
    },
  })
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Query('search') search?: string,
  ) {
    const payload: FindAllUsersPayload = { page, size, search }
    const result = await lastValueFrom(
      this.authService.send('find-all-users', payload).pipe(
        catchError(error => {
          return throwError(
            () => new HttpException(error.message, error.status),
          )
        }),
      ),
    )

    return result
  }

  @Get('users/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter usuário por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID único do usuário no formato UUID',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
        username: { type: 'string', example: 'johndoe' },
        email: {
          type: 'string',
          format: 'email',
          example: 'johndoe@example.com',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-01T00:00:00.000Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-01T00:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Usuário não encontrado' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T07:16:00.803Z',
        },
        path: { type: 'string', example: '/api/auth/users/:id' },
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
        message: { type: 'string', example: 'Não autorizado' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T07:16:00.803Z',
        },
        path: { type: 'string', example: '/api/auth/users/:id' },
      },
    },
  })
  async getUserById(@Param('id') id: string) {
    const result = await lastValueFrom(
      this.authService.send('find-user-by-id', id).pipe(
        catchError(error => {
          return throwError(
            () => new HttpException(error.message, error.status),
          )
        }),
      ),
    )

    return result
  }

  @Patch('users/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar usuário por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID único do usuário no formato UUID',
    type: 'string',
  })
  @ApiBody({
    description: 'Dados para atualizar o usuário (campos opcionais)',
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          example: 'newusername',
          minLength: 3,
          description: 'Nome de usuário único para o usuário',
        },
        email: {
          type: 'string',
          format: 'email',
          example: 'newemail@example.com',
          description: 'Endereço de email único para o usuário',
        },
      },
      required: ['username', 'email'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
        username: { type: 'string', example: 'newusername' },
        email: {
          type: 'string',
          format: 'email',
          example: 'newemail@example.com',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-01T00:00:00.000Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-02T00:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Usuário não encontrado' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T07:16:00.803Z',
        },
        path: { type: 'string', example: '/api/auth/users/:id' },
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
        message: { type: 'string', example: 'Não autorizado' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T07:16:00.803Z',
        },
        path: { type: 'string', example: '/api/auth/users/:id' },
      },
    },
  })
  async updateUserById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    updateUserDto.id = id

    const result = await lastValueFrom(
      this.authService.send('update-user', updateUserDto).pipe(
        catchError(error => {
          return throwError(
            () => new HttpException(error.message, error.status),
          )
        }),
      ),
    )

    return result
  }

  @Delete('users/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar usuário por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID único do usuário no formato UUID',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário deletado com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Usuário deletado com sucesso' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Usuário não encontrado' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T07:16:00.803Z',
        },
        path: { type: 'string', example: '/api/auth/users/:id' },
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
        message: { type: 'string', example: 'Não autorizado' },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-26T07:16:00.803Z',
        },
        path: { type: 'string', example: '/api/auth/users/:id' },
      },
    },
  })
  async deleteUserById(@Param('id') id: string) {
    const result = await lastValueFrom(
      this.authService.send('remove-user', id).pipe(
        catchError(error => {
          return throwError(
            () => new HttpException(error.message, error.status),
          )
        }),
      ),
    )

    return result
  }
}
