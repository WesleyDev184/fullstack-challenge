import { User } from '@/shared/database/entities/user.entity'
import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateUserDto, UpdateUserDto } from '@repo/types'
import * as bcrypt from 'bcryptjs'
import { EntityManager, Repository } from 'typeorm'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, email, password } = createUserDto

    const existingUser = await this.findByEmail(email)

    if (existingUser) {
      return new HttpException('Email already in use', 400)
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
    })

    return await this.entityManager.save(user)
  }

  async findAll() {
    return await this.usersRepository.find()
  }

  async findOne(id: string) {
    return await this.usersRepository.findOneBy({ id })
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    let res: User | undefined

    await this.entityManager.transaction(async entityManager => {
      const user = await this.usersRepository.findOneBy({ id })

      if (user) {
        res = Object.assign(user, updateUserDto)

        await entityManager.save(user)
      }
    })

    if (!res) {
      return new HttpException('User not found', 404)
    }

    return res
  }

  async remove(id: string) {
    const res = await this.usersRepository.delete(id)

    if (res.affected === 0) {
      return new HttpException('User not found', 404)
    }

    return { message: `User ${id} deleted successfully` }
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email })
  }
}
