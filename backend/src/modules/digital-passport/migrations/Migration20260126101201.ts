import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260126101201 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "digital_passport" drop constraint if exists "digital_passport_token_id_unique";`);
    this.addSql(`create table if not exists "digital_passport" ("id" text not null, "order_id" text not null, "token_id" text not null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "digital_passport_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_digital_passport_token_id_unique" ON "digital_passport" ("token_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_digital_passport_deleted_at" ON "digital_passport" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "digital_passport" cascade;`);
  }

}
