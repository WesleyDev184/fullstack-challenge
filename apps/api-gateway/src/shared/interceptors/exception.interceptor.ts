import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { Response } from 'express'

@Catch()
export class ExceptionInterceptor implements ExceptionFilter {
  private readonly logger = new Logger(ExceptionInterceptor.name)

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    this.logger.error(`Error caught by filter: ${exception.message}`)

    let status = 500
    let message = 'Internal server error'

    if (exception instanceof RpcException) {
      const rpcError = exception.getError()
      if (typeof rpcError === 'object' && rpcError !== null) {
        status = (rpcError as any).status || 500
        message = (rpcError as any).message || 'RPC error'
      } else {
        message = rpcError as string
      }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus()
      const response = exception.getResponse()
      message =
        typeof response === 'string'
          ? response
          : (response as any).message || exception.message
    } else {
      message = exception.message || message
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: (request as any).url,
    })
  }
}
