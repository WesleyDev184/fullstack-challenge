import { User } from '@/shared/database/entities/user.entity'
import { HttpException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  CreateUserDto,
  ResponseUserDto,
  ResponseUserListDto,
  UpdateUserDto,
} from '@repo/types'
import * as bcrypt from 'bcryptjs'
import { EntityManager, In, Repository } from 'typeorm'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const { username, email, password } = createUserDto

    const existingUserByEmail = await this.findByEmail(email)
    if (existingUserByEmail) {
      throw new HttpException('Email already in use', 409)
    }

    const existingUserByUsername = await this.usersRepository.findOneBy({
      username,
    })
    if (existingUserByUsername) {
      throw new HttpException('Username already in use', 409)
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

  async findOne(id: string): Promise<ResponseUserDto> {
    const user = await this.usersRepository.findOneBy({ id })

    if (!user) {
      throw new HttpException('User not found', 404)
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
  ): Promise<ResponseUserDto> {
    let res: User | undefined

    await this.entityManager
      .transaction(async entityManager => {
        const user = await this.usersRepository.findOneBy({ id })

        if (!user) {
          throw new HttpException('User not found', 404)
        }

        if (updateUserDto.email && updateUserDto.email !== user.email) {
          const existingUserByEmail = await this.findByEmail(
            updateUserDto.email,
          )
          if (existingUserByEmail) {
            throw new HttpException('Email already in use', 409)
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
            throw new HttpException('Username already in use', 409)
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
          return new HttpException('User not found', 404)
        }
        if (
          error.message === 'Email already in use' ||
          error.message === 'Username already in use'
        ) {
          return new HttpException(error.message, 409)
        }
        throw error // Re-throw outros erros
      })

    if (!res) {
      throw new HttpException('User not found', 404)
    }

    return new ResponseUserDto(
      res.id,
      res.email,
      res.username,
      res.createdAt,
      res.updatedAt,
    )
  }

  async remove(id: string): Promise<{ message: string }> {
    const res = await this.usersRepository.delete(id)

    if (res.affected === 0) {
      throw new HttpException('User not found', 404)
    }

    return { message: `User ${id} deleted successfully` }
  }

  async validateUsers(ids: string[]): Promise<string[]> {
    const users = await this.usersRepository.find({
      select: ['id'],
      where: { id: In(ids) },
    })
    return users.map(user => user.id)
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ email })
  }
}
