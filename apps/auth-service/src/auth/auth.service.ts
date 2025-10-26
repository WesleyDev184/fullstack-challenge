import { HttpException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import {
  LoginDto,
  ResponseTokensDto,
  ResponseValidateTokenDto,
} from '@repo/types'
import * as bcrypt from 'bcryptjs'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<ResponseTokensDto> {
    const { email, password } = loginDto
    const user = await this.usersService.findByEmail(email)

    if (!user || !user.password) {
      throw new HttpException('Invalid credentials', 401)
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', 401)
    }

    const tokens = await this.generateTokens(user.id, user.email)

    return tokens
  }

  async validateToken(
    token: string,
  ): Promise<ResponseValidateTokenDto | HttpException> {
    try {
      await this.jwtService.verify(token)
      const id = this.jwtService.decode(token) as { sub: string }

      const user = await this.usersService.findOne(id.sub)

      if (user instanceof HttpException) {
        throw new HttpException('User not found', 404)
      }

      return {
        valid: true,
        user,
      }
    } catch (error) {
      throw new HttpException('Invalid token', 401)
    }
  }

  async refreshToken(
    token: string,
  ): Promise<ResponseTokensDto | HttpException> {
    try {
      const payload = this.jwtService.verify(token)

      const tokens = await this.generateTokens(payload.sub, payload.email)

      return tokens
    } catch (error) {
      return new HttpException('Invalid refresh token', 401)
    }
  }

  async generateTokens(
    userId: string,
    email: string,
  ): Promise<ResponseTokensDto> {
    const payload = { email, sub: userId }
    const accessToken = this.jwtService.sign(payload)
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' })

    return {
      accessToken,
      refreshToken,
    }
  }
}
