// src/shared/database/entities/user.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'users' }) // Define o nome da tabela
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  // Adicione outros campos que precisar...
}
