import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddTaskRef1761538256062 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            -- Adiciona a coluna de referência à task
            ALTER TABLE "notification" 
                ADD COLUMN "task_id" uuid;
            
            -- Cria índice para buscar notificações por task
            CREATE INDEX "IDX_notification_task_id" 
                ON "notification" ("task_id");
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            -- Remove o índice
            DROP INDEX IF EXISTS "IDX_notification_task_id";
            
            -- Remove a coluna de referência à task
            ALTER TABLE "notification" 
                DROP COLUMN IF EXISTS "task_id";
        `)
  }
}
