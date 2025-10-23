import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto)
    return this.entityManager.save(user)
  }

  async findAll() {
    return this.usersRepository.find()
  }

  async findOne(id: string) {
    return this.usersRepository.findOneBy({ id })
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    let res
    await this.entityManager.transaction(async entityManager => {
      const user = await this.usersRepository.findOneBy({ id })
      if (user) {
        res = Object.assign(user, updateUserDto)
        await entityManager.save(user)
      }
    })
    return res
  }

  remove(id: string) {
    return this.usersRepository.delete(id)
  }
}
