import { AuthGuard } from '@/guards/auth/auth.guard'
import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { AUTH_SERVICE_NAME } from '@repo/consts'
import { CreateUserDto, LoginDto } from '@repo/types'
import { lastValueFrom } from 'rxjs'

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE_NAME) private readonly authService: ClientProxy,
  ) {}

  @Post('register')
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
  async login(@Body() body: LoginDto) {
    const result = await lastValueFrom(this.authService.send('login', body))
    if (result.status && result.message) {
      throw new HttpException(result.message, result.status)
    }
    return result
  }

  @Get('users')
  @UseGuards(AuthGuard)
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
  async getUserById(@Param('id') id: string) {
    const result = await lastValueFrom(
      this.authService.send('find-user-by-id', id),
    )
    if (result.status && result.message) {
      throw new HttpException(result.message, result.status)
    }
    return result
  }
}
