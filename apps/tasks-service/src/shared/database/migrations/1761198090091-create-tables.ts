import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTables1761198090091 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_type t
            JOIN pg_namespace n ON t.typnamespace = n.oid
            WHERE t.typname = 'task_priority_enum' AND n.nspname = 'public'
          ) THEN
            CREATE TYPE public.task_priority_enum AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
          END IF;
          IF NOT EXISTS (
            SELECT 1 FROM pg_type t
            JOIN pg_namespace n ON t.typnamespace = n.oid
            WHERE t.typname = 'task_status_enum' AND n.nspname = 'public'
          ) THEN
            CREATE TYPE public.task_status_enum AS ENUM ('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE');
          END IF;
      END$$;

      CREATE OR REPLACE FUNCTION trigger_set_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TABLE IF NOT EXISTS "task" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "title" character varying NOT NULL,
          "description" text,
          "due_at" TIMESTAMP,
          "priority" public.task_priority_enum NOT NULL DEFAULT 'MEDIUM',
          "status" public.task_status_enum NOT NULL DEFAULT 'TODO',
          "created_by" uuid NOT NULL,
          "created_at" TIMESTAMP NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "PK_task_id" PRIMARY KEY ("id")
      );

      CREATE TRIGGER "set_timestamp_task"
      BEFORE UPDATE ON "task"
      FOR EACH ROW
      EXECUTE PROCEDURE trigger_set_timestamp();

      CREATE TABLE IF NOT EXISTS "task_assignee" (
          "task_id" uuid NOT NULL,
          "user_id" uuid NOT NULL,
          "assigned_at" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "PK_task_assignee" PRIMARY KEY ("task_id", "user_id"),
          CONSTRAINT "FK_task_assignee_task" FOREIGN KEY ("task_id") REFERENCES "task" ("id") ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS "task_comment" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "task_id" uuid NOT NULL,
          "author_id" uuid NOT NULL,
          "content" text NOT NULL,
          "created_at" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "PK_task_comment_id" PRIMARY KEY ("id"),
          CONSTRAINT "FK_task_comment_task" FOREIGN KEY ("task_id") REFERENCES "task" ("id") ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS "task_history" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "task_id" uuid NOT NULL,
          "actor_id" uuid, 
          "change" text NOT NULL, 
          "metadata" jsonb,
          "created_at" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "PK_task_history_id" PRIMARY KEY ("id"),
          CONSTRAINT "FK_task_history_task" FOREIGN KEY ("task_id") REFERENCES "task" ("id") ON DELETE CASCADE
      );

      -- Para buscar tasks de um usuário
      CREATE INDEX IF NOT EXISTS "IDX_task_created_by" ON "task" ("created_by");
      
      -- Para buscar tasks por data de vencimento (calendário)
      CREATE INDEX IF NOT EXISTS "IDX_task_due_at" ON "task" ("due_at" ASC NULLS LAST); -- Adicionado ASC NULLS LAST

      -- Índice otimizado para visão Kanban/Lista (Status, Prioridade, Data)
      CREATE INDEX IF NOT EXISTS "IDX_task_kanban_view" ON "task" ("status", "priority" DESC, "due_at" ASC NULLS LAST);

      -- Para buscar tasks de um usuário
      CREATE INDEX IF NOT EXISTS "IDX_task_assignee_user" ON "task_assignee" ("user_id");
      
      -- Para buscar comentários de uma task, ordenados
      CREATE INDEX IF NOT EXISTS "IDX_task_comment_task_created" ON "task_comment" ("task_id", "created_at" DESC); 
      
      -- Para buscar histórico de uma task, ordenado
      CREATE INDEX IF NOT EXISTS "IDX_task_history_task_created" ON "task_history" ("task_id", "created_at" DESC); 
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_task_created_by";
      DROP INDEX IF EXISTS "IDX_task_due_at";
      DROP INDEX IF EXISTS "IDX_task_kanban_view"; -- MELHORIA: Nome do índice atualizado
      DROP INDEX IF EXISTS "IDX_task_assignee_user";
      DROP INDEX IF EXISTS "IDX_task_comment_task_created";
      DROP INDEX IF EXISTS "IDX_task_history_task_created";
      
      DROP TRIGGER IF EXISTS "set_timestamp_task" ON "task";
      DROP FUNCTION IF EXISTS trigger_set_timestamp();

      DROP TABLE IF EXISTS "task_history";
      DROP TABLE IF EXISTS "task_comment";
      DROP TABLE IF EXISTS "task_assignee";
      DROP TABLE IF EXISTS "task";

      DO $$ BEGIN
          IF EXISTS (
            SELECT 1 FROM pg_type t
            JOIN pg_namespace n ON t.typnamespace = n.oid
            WHERE t.typname = 'task_priority_enum' AND n.nspname = 'public'
          ) THEN
            DROP TYPE public.task_priority_enum;
          END IF;
          IF EXISTS (
            SELECT 1 FROM pg_type t
            JOIN pg_namespace n ON t.typnamespace = n.oid
            WHERE t.typname = 'task_status_enum' AND n.nspname = 'public'
          ) THEN
            DROP TYPE public.task_status_enum;
          END IF;
      END$$;

    `)
  }
}
