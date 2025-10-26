import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { AUTH_SERVICE_NAME } from '@repo/consts'
import { catchError, firstValueFrom, throwError } from 'rxjs'

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
      this.authService.send('validate-token', token).pipe(
        catchError(error => {
          return throwError(
            () => new HttpException(error.message, error.status || 500),
          )
        }),
      ),
    )

    if (validateToken.valid && validateToken.user) {
      request.user = validateToken.user
      return true
    }

    return false
  }
}
