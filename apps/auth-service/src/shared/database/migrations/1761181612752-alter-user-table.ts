import { MigrationInterface, QueryRunner } from 'typeorm'

export class AlterUserTable1761181612752 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD COLUMN "isActive" boolean NOT NULL DEFAULT true`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isActive"`)
  }
}
