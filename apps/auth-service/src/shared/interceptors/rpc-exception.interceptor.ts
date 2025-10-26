import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

@Injectable()
export class RpcExceptionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RpcExceptionInterceptor.name)

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        this.logger.error(`Error caught by interceptor: ${error.message}`)

        if (error instanceof RpcException) {
          return throwError(() => error)
        }

        if (error instanceof HttpException) {
          const status = error.getStatus()
          const response = error.getResponse()

          const rpcError = {
            status,
            message:
              typeof response === 'string'
                ? response
                : (response as any).message,
          }

          return throwError(() => new RpcException(rpcError))
        }

        const rpcError = {
          status: 500,
          message: error.message || 'Internal server error',
        }

        return throwError(() => new RpcException(rpcError))
      }),
    )
  }
}
