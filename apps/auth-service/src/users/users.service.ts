import { User } from '@/shared/database/entities/user.entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  CreateUserDto,
  HttpError,
  ResponseUserDto,
  ResponseUserListDto,
  UpdateUserDto,
} from '@repo/types'
import * as bcrypt from 'bcryptjs'
import { EntityManager, Repository } from 'typeorm'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<ResponseUserDto | HttpError> {
    const { username, email, password } = createUserDto

    const existingUser = await this.findByEmail(email)

    if (existingUser) {
      return new HttpError('Email already in use', 400)
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
    })

    const res = await this.entityManager.save(user)

    return new ResponseUserDto(
      res.id,
      res.email,
      res.username,
      res.createdAt,
      res.updatedAt,
    )
  }

  async findAll(): Promise<ResponseUserListDto> {
    const [users, count] = await this.usersRepository.findAndCount()
    return new ResponseUserListDto(
      count,
      users.map(
        user =>
          new ResponseUserDto(
            user.id,
            user.email,
            user.username,
            user.createdAt,
            user.updatedAt,
          ),
      ),
    )
  }

  async findOne(id: string): Promise<ResponseUserDto | HttpError> {
    const user = await this.usersRepository.findOneBy({ id })

    if (!user) {
      return new HttpError('User not found', 404)
    }

    return new ResponseUserDto(
      user.id,
      user.email,
      user.username,
      user.createdAt,
      user.updatedAt,
    )
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto | HttpError> {
    let res: User | undefined

    await this.entityManager.transaction(async entityManager => {
      const user = await this.usersRepository.findOneBy({ id })

      if (user) {
        res = Object.assign(user, updateUserDto)

        await entityManager.save(user)
      }
    })

    if (!res) {
      return new HttpError('User not found', 404)
    }

    return new ResponseUserDto(
      res.id,
      res.email,
      res.username,
      res.createdAt,
      res.updatedAt,
    )
  }

  async remove(id: string): Promise<{ message: string } | HttpError> {
    const res = await this.usersRepository.delete(id)

    if (res.affected === 0) {
      return new HttpError('User not found', 404)
    }

    return { message: `User ${id} deleted successfully` }
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ email })
  }
}
