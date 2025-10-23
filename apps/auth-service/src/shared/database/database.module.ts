import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as path from 'path'
import { DataSource } from 'typeorm'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('DB_HOST', 'localhost')
        const port = configService.get<number>('DB_PORT', 5432)
        const username = configService.get<string>('DB_USERNAME', 'postgres')
        const password = configService.get<string>('DB_PASSWORD', 'password')
        const database = configService.get<string>('DB_NAME', 'challenge_db')
        const schema = configService.get<string>('DB_SCHEMA', 'public')

        const options = `-c search_path=${schema},public`

        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          schema,
          extra: { options },
          entities: [path.join(__dirname, 'entities', '*.entity{.ts,.js}')],
          migrations: [path.join(__dirname, 'migrations', '*{.ts,.js}')],
          migrationsRun: false,
          logging: true,
          synchronize: false,
        }
      },
      dataSourceFactory: async options => {
        const schema = (options as any).schema ?? 'public'

        const dsOptions = {
          ...(options as any),
          migrationsRun: false,
        }

        const ds = new DataSource(dsOptions)
        await ds.initialize()

        try {
          await ds.query(`CREATE SCHEMA IF NOT EXISTS "${schema}";`)
          try {
            await ds.query(
              `CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;`,
            )
          } catch (extErr) {
            console.warn(
              'Could not create extension uuid-ossp:',
              (extErr as any)?.message ?? String(extErr),
            )
          }

          try {
            await ds.runMigrations()
          } catch (migErr) {
            console.error(
              'Failed to run migrations:',
              (migErr as any)?.message ?? String(migErr),
            )
            throw migErr
          }
        } catch (e) {
          try {
            if (ds.isInitialized) await ds.destroy()
          } catch (_) {}
          throw e
        }

        return ds
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
