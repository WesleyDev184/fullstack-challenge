import { HttpException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { LoginDto } from '@repo/types'
import * as bcrypt from 'bcryptjs'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  private refreshTokens: Map<string, string> = new Map() // Simple in-memory store for refresh tokens

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto
    const user = await this.usersService.findByEmail(email)

    if (!user || !user.password) {
      return new HttpException('Invalid credentials', 401)
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return new HttpException('Invalid credentials', 401)
    }

    const payload = { email: user.email, sub: user.id }
    const accessToken = this.jwtService.sign(payload)
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' })

    // Store refresh token
    this.refreshTokens.set(user.id, refreshToken)

    return {
      accessToken,
      refreshToken,
    }
  }

  async validateToken(token: string) {
    try {
      await this.jwtService.verify(token)
      const id = this.jwtService.decode(token) as { sub: string }

      const user = await this.usersService.findOne(id.sub)
      return {
        valid: true,
        user,
      }
    } catch (error) {
      return new HttpException('Invalid token', 401)
    }
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token)
      const storedToken = this.refreshTokens.get(payload.sub)

      if (!storedToken || storedToken !== token) {
        return new HttpException('Invalid refresh token', 401)
      }

      const newPayload = { email: payload.email, sub: payload.sub }
      const newAccessToken = this.jwtService.sign(newPayload)

      return {
        accessToken: newAccessToken,
      }
    } catch (error) {
      return new HttpException('Invalid refresh token', 401)
    }
  }
}
