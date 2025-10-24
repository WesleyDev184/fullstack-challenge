import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { AUTH_SERVICE_NAME } from '@repo/consts'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH_SERVICE_NAME) private readonly authService: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers['authorization']

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false
    }
    const token = authHeader.split(' ')[1]

    const validateToken = await firstValueFrom(
      this.authService.send('validate-token', token),
    )

    if (validateToken.valid && validateToken.user) {
      request.user = validateToken.user
      return true
    }
    return false
  }
}
