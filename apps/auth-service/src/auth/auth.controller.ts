import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { LoginDto } from '@repo/types'
import { AuthService } from './auth.service'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('login')
  async login(@Payload() loginDto: LoginDto) {
    return await this.authService.login(loginDto)
  }

  @MessagePattern('validateToken')
  async validateToken(@Payload() token: string) {
    return await this.authService.validateToken(token)
  }

  @MessagePattern('refreshToken')
  async refreshToken(@Payload() token: string) {
    return await this.authService.refreshToken(token)
  }
}
