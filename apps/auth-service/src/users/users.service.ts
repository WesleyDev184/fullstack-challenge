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

    const existingUserByEmail = await this.findByEmail(email)
    if (existingUserByEmail) {
      return new HttpError('Email already in use', 400)
    }

    const existingUserByUsername = await this.usersRepository.findOneBy({
      username,
    })
    if (existingUserByUsername) {
      return new HttpError('Username already in use', 400)
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

    await this.entityManager
      .transaction(async entityManager => {
        const user = await this.usersRepository.findOneBy({ id })

        if (!user) {
          throw new Error('User not found')
        }

        if (updateUserDto.email && updateUserDto.email !== user.email) {
          const existingUserByEmail = await this.findByEmail(
            updateUserDto.email,
          )
          if (existingUserByEmail) {
            throw new Error('Email already in use')
          }
        }

        if (
          updateUserDto.username &&
          updateUserDto.username !== user.username
        ) {
          const existingUserByUsername = await this.usersRepository.findOneBy({
            username: updateUserDto.username,
          })
          if (existingUserByUsername) {
            throw new Error('Username already in use')
          }
        }

        // Hash da senha se fornecida
        if (updateUserDto.password) {
          updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10)
        }

        res = Object.assign(user, updateUserDto)
        await entityManager.save(user)
      })
      .catch(error => {
        if (error.message === 'User not found') {
          return new HttpError('User not found', 404)
        }
        if (
          error.message === 'Email already in use' ||
          error.message === 'Username already in use'
        ) {
          return new HttpError(error.message, 400)
        }
        throw error // Re-throw outros erros
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
