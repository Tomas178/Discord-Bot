import { CamelCasePlugin, Kysely, SqliteDialect } from 'kysely';
import ModuleMigrationProvider from './ModuleMigrationProvider';
import SQLite from 'better-sqlite3';
import { DB } from '@/database';
import { migrateToLatest } from '@/database/migrate';

const DATABASE_FILE = ':memory:';

export default async () => {
  const provider = new ModuleMigrationProvider();

  const database = new Kysely<DB>({
    dialect: new SqliteDialect({ database: new SQLite(DATABASE_FILE) }),
    plugins: [new CamelCasePlugin()],
  });

  const { results, error } = await migrateToLatest(provider, database);

  results
    ?.filter((result) => result.status === 'Error')
    .forEach((result) => {
      console.error(`Failed to execute migration "${result.migrationName}"`);
    });

  if (error) {
    console.error('Failed to migrate');
    console.error(error);
  }

  return database;
};
