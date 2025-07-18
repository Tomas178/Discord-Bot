import { ExpressionOrFactory, Insertable, Kysely, SqlBool } from 'kysely';
import { DB } from '@/database';

type HelperType<N extends keyof DB> = { [P in N]: DB[P] };

export const createFor =
  <N extends keyof DB, T extends HelperType<N>>(db: Kysely<T>, tableName: N) =>
  (records: Insertable<DB[N]> | Insertable<DB[N]>[]) =>
    db
      .insertInto(tableName)
      .values(records as any)
      .returningAll()
      .execute();

export const selectAllFor =
  <N extends keyof DB, T extends HelperType<N>>(db: Kysely<T>, tableName: N) =>
  (expression?: ExpressionOrFactory<DB, N, SqlBool>) => {
    const query = db.selectFrom(tableName).selectAll();

    return expression
      ? (query.where as any)(expression).execute()
      : query.execute();
  };
