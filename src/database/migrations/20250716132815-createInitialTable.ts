import { Kysely, sql, SqliteDatabase } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('users')
    .ifNotExists()
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('username', 'text', (c) => c.notNull().unique())
    .execute();

  await db.schema
    .createTable('sprints')
    .ifNotExists()
    .addColumn('id', 'integer', (c) => c.primaryKey().notNull().autoIncrement())
    .addColumn('sprint_code', 'text', (c) => c.notNull().unique())
    .execute();

  await db.schema
    .createTable('templates')
    .ifNotExists()
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('template_message', 'text', (c) => c.notNull().unique())
    .execute();

  await db.schema
    .createTable('messages')
    .ifNotExists()
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement().notNull())
    .addColumn('message', 'text', (c) => c.notNull())
    .addColumn('sprintCode', 'text', (c) => c.notNull())
    .addColumn('username', 'text', (c) => c.notNull())
    .addColumn('created_at', 'datetime', (c) =>
      c.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute();
}
