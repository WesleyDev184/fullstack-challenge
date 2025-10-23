import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserTable1761181115844 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "user" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" character varying NOT NULL,
            "email" character varying NOT NULL,
            "password" character varying,
            CONSTRAINT "UQ_email" UNIQUE ("email"),
            CONSTRAINT "PK_id" PRIMARY KEY ("id")
        )`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`)
  }
}
