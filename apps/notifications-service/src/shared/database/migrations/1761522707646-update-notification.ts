import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateNotification1761522707646 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            -- Remove os índices antigos
            DROP INDEX IF EXISTS "IDX_notification_recipient_created_at";
            DROP INDEX IF EXISTS "IDX_notification_recipient_unread";
            
            -- Remove as colunas antigas
            ALTER TABLE "notification" 
                DROP COLUMN IF EXISTS "recipient_id",
                DROP COLUMN IF EXISTS "read_at";
            
            -- Adiciona a nova coluna para lista de IDs
            ALTER TABLE "notification" 
                ADD COLUMN "assignee_ids" uuid[] NOT NULL DEFAULT '{}';
            
            -- Cria novo índice para buscar notificações por assignee
            CREATE INDEX "IDX_notification_assignee_ids" 
                ON "notification" USING GIN ("assignee_ids");
            
            -- Cria índice para buscar notificações por data de criação
            CREATE INDEX "IDX_notification_created_at" 
                ON "notification" ("created_at" DESC);
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            -- Remove os novos índices
            DROP INDEX IF EXISTS "IDX_notification_assignee_ids";
            DROP INDEX IF EXISTS "IDX_notification_created_at";
            
            -- Remove a coluna de assignee_ids
            ALTER TABLE "notification" 
                DROP COLUMN IF EXISTS "assignee_ids";
            
            -- Restaura as colunas antigas
            ALTER TABLE "notification" 
                ADD COLUMN "recipient_id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                ADD COLUMN "read_at" TIMESTAMP;
            
            -- Restaura os índices antigos
            CREATE INDEX "IDX_notification_recipient_created_at" 
                ON "notification" ("recipient_id", "created_at" DESC);
            
            CREATE INDEX "IDX_notification_recipient_unread" 
                ON "notification" ("recipient_id") 
                WHERE "read_at" IS NULL;
        `)
  }
}
