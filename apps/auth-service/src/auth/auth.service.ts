import { Injectable } from '@nestjs/common'
import { LoginDto } from '@repo/types'

@Injectable()
export class AuthService {
  async refreshToken(token: string) {
    throw new Error('Method not implemented.')
  }
  async validateToken(token: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
  async login(loginDto: LoginDto) {
    throw new Error('Method not implemented.')
  }
}
