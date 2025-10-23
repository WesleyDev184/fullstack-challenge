import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserTable1761181115844 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION trigger_set_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TABLE IF NOT EXISTS "user" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "username" character varying NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL, 
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 

        CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
      );

      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_user_username_unique_lower" 
        ON "user" (LOWER("username"));
        
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_user_email_unique_lower" 
        ON "user" (LOWER("email"));
        
      DROP TRIGGER IF EXISTS "set_timestamp_user" ON "user";
      CREATE TRIGGER "set_timestamp_user"
      BEFORE UPDATE ON "user"
      FOR EACH ROW
      EXECUTE PROCEDURE trigger_set_timestamp();
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS "set_timestamp_user" ON "user";

      DROP INDEX IF EXISTS "IDX_user_username_unique_lower";
      DROP INDEX IF EXISTS "IDX_user_email_unique_lower";

      DROP TABLE IF EXISTS "user";
    `)
  }
}
