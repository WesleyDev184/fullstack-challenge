import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index('IDX_user_username_unique_lower', ['username'], { unique: true })
  @Column('varchar')
  username: string

  @Index('IDX_user_email_unique_lower', ['email'], { unique: true })
  @Column('varchar')
  email: string

  @Column('varchar', { nullable: true })
  password?: string

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date
}
