import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'

@Controller()
export class HealthController {
  @MessagePattern({ cmd: 'health' })
  async check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'tasks-service',
    }
  }
}
