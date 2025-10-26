import { RpcExceptionInterceptor } from '@/shared/interceptors/rpc-exception.interceptor'
import { Controller, HttpException, UseInterceptors } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CreateUserDto, UpdateUserDto } from '@repo/types'
import { UsersService } from './users.service'

@Controller()
@UseInterceptors(RpcExceptionInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('create-user')
  async create(@Payload() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto)
  }

  @MessagePattern('find-all-users')
  async findAll() {
    return await this.usersService.findAll()
  }

  @MessagePattern('find-user-by-id')
  async findOne(@Payload() id: string) {
    return await this.usersService.findOne(id)
  }

  @MessagePattern('update-user')
  async update(@Payload() updateUserDto: UpdateUserDto) {
    if (!updateUserDto.id) {
      throw new HttpException('User ID is required for update', 400)
    }

    return await this.usersService.update(updateUserDto.id, updateUserDto)
  }

  @MessagePattern('remove-user')
  async remove(@Payload() id: string) {
    return await this.usersService.remove(id)
  }

  @MessagePattern('validate-users')
  async validate(@Payload() ids: string[]) {
    return await this.usersService.validateUsers(ids)
  }
}
