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
import { CreateUserDto, LoginDto, UpdateUserDto } from '@repo/types'
import { lastValueFrom } from 'rxjs'

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE_NAME) private readonly authService: ClientProxy,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar um novo usuário' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'johndoe', minLength: 3 },
        email: {
          type: 'string',
          format: 'email',
          example: 'johndoe@example.com',
        },
        password: {
          type: 'string',
          example: 'strongpassword123',
          minLength: 8,
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
        status: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Mensagem de erro' },
      },
    },
  })
  async register(@Body() body: CreateUserDto) {
    const result = await lastValueFrom(
      this.authService.send('create-user', body),
    )

    if (result.status && result.message) {
      throw new HttpException(result.message, result.status)
    }

    return result
  }

  @Post('login')
  @ApiOperation({ summary: 'Fazer login do usuário' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'johndoe@example.com',
        },
        password: {
          type: 'string',
          example: 'strongpassword123',
          minLength: 8,
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
        status: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Credenciais inválidas' },
      },
    },
  })
  async login(@Body() body: LoginDto) {
    const result = await lastValueFrom(this.authService.send('login', body))
    if (result.status && result.message) {
      throw new HttpException(result.message, result.status)
    }
    return result
  }

  @Post('refresh')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar tokens de autenticação' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string', example: 'refresh-token-aqui' },
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
        status: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Token de atualização inválido' },
      },
    },
  })
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    const result = await lastValueFrom(
      this.authService.send('refresh-token', refreshToken),
    )
    if (result.status && result.message) {
      throw new HttpException(result.message, result.status)
    }
    return result
  }

  @Get('users')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 1 },
        users: {
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
        status: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Não autorizado' },
      },
    },
  })
  async getAllUsers() {
    const result = await lastValueFrom(
      this.authService.send('find-all-users', {}),
    )
    if (result.status && result.message) {
      throw new HttpException(result.message, result.status)
    }
    return result
  }

  @Get('users/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter usuário por ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário', type: 'string' })
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
        status: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Usuário não encontrado' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Não autorizado' },
      },
    },
  })
  async getUserById(@Param('id') id: string) {
    const result = await lastValueFrom(
      this.authService.send('find-user-by-id', id),
    )
    if (result.status && result.message) {
      throw new HttpException(result.message, result.status)
    }
    return result
  }

  @Patch('users/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar usuário por ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário', type: 'string' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'newusername', minLength: 3 },
        email: {
          type: 'string',
          format: 'email',
          example: 'newemail@example.com',
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
        status: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Usuário não encontrado' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Não autorizado' },
      },
    },
  })
  async updateUserById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    updateUserDto.id = id

    const result = await lastValueFrom(
      this.authService.send('update-user', updateUserDto),
    )
    if (result.status && result.message) {
      throw new HttpException(result.message, result.status)
    }
    return result
  }

  @Delete('users/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar usuário por ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário', type: 'string' })
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
        status: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Usuário não encontrado' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Não autorizado' },
      },
    },
  })
  async deleteUserById(@Param('id') id: string) {
    const result = await lastValueFrom(this.authService.send('remove-user', id))
    if (result.status && result.message) {
      throw new HttpException(result.message, result.status)
    }
    return result
  }
}
