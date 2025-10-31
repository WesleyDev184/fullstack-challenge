import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateTask1761879284503 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "task" ADD COLUMN "content" text;
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "task" DROP COLUMN IF EXISTS "content";
        `)
  }
}
