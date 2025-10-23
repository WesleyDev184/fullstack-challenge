import { MigrationInterface, QueryRunner } from 'typeorm'

export class NotificationTable1761197937171 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_type t
          JOIN pg_namespace n ON t.typnamespace = n.oid
          WHERE t.typname = 'notification_category_enum' AND n.nspname = 'public'
        ) THEN
          CREATE TYPE public.notification_category_enum AS ENUM ('ASSIGNMENT', 'CHANGE_STATUS', 'NEW_COMMENT');
        END IF;
      END$$;

      CREATE TABLE IF NOT EXISTS "notification" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "recipient_id" uuid NOT NULL,
        "title" character varying NOT NULL,
        "content" text NOT NULL,
        "category" public.notification_category_enum NOT NULL,
        "read_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_notification_id" PRIMARY KEY ("id")
      );

      
      CREATE INDEX IF NOT EXISTS "IDX_notification_recipient_created_at" 
        ON "notification" ("recipient_id", "created_at" DESC);

      CREATE INDEX IF NOT EXISTS "IDX_notification_recipient_unread" 
        ON "notification" ("recipient_id") 
        WHERE "read_at" IS NULL;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_notification_recipient_created_at";
      DROP INDEX IF EXISTS "IDX_notification_recipient_unread";
      
      DROP TABLE IF EXISTS "notification";
      
      DO $$ BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_category_enum') THEN
          DROP TYPE "notification_category_enum";
        END IF;
      END$$;
    `)
  }
}
