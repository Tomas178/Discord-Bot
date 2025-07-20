import { Kysely, SqliteDatabase } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .alterTable('messages')
    .addColumn('gif_url', 'text', (c) => c.notNull().defaultTo(''))
    .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.alterTable('messages').dropColumn('gif_url').execute();
}
