// src/data-source.ts
import 'dotenv/config' // Importe para carregar o .env
import { DataSource, DataSourceOptions } from 'typeorm'

// Verifique se as variáveis de ambiente essenciais estão carregadas
if (!process.env.DB_HOST) {
  throw new Error(
    'Variáveis de ambiente do banco de dados não carregadas. Verifique seu .env',
  )
}

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432, // Converte a string para número com fallback
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // Caminhos para os arquivos .ts (para desenvolvimento com ts-node)
  // Ajuste esses caminhos conforme sua estrutura de projeto
  entities: ['src/shared/database/entities/**/*.ts'],
  migrations: ['src/shared/database/migrations/*.ts'], // Onde suas migrations serão geradas

  // Importante: Configuração da CLI para o TypeORM
  migrationsTableName: 'migrations_history', // Tabela que armazena o histórico
  migrationsTransactionMode: 'each', // Executar cada migration em uma transação
  synchronize: false, // Nunca use synchronize: true em produção
}

const dataSource = new DataSource(dataSourceOptions)
export default dataSource
