import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common'
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
      this.authService.send('createUser', body),
    )
    return result
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const result = await lastValueFrom(this.authService.send('login', body))
    return result
  }

  @Get('users')
  async getAllUsers() {
    const result = await lastValueFrom(
      this.authService.send('findAllUsers', {}),
    )
    return result
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    const result = await lastValueFrom(
      this.authService.send('findUserById', id),
    )
    return result
  }
}
