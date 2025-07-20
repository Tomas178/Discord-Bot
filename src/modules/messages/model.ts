import { Database, Messages } from '@/database';
import { Insertable, Selectable } from 'kysely';
import { keys } from './schema';

const TABLE = 'messages';
type Row = Messages;
type RowWithoutIdAndCreatedAt = Omit<Row, 'id' | 'createdAt'>;
export type RowInsert = Insertable<RowWithoutIdAndCreatedAt>;
type RowSelect = Selectable<Row>;

export default (db: Database) => ({
  findAll: async (): Promise<RowSelect[]> =>
    db.selectFrom(TABLE).selectAll().execute(),

  findByUsername: async (username: string): Promise<RowSelect[]> =>
    db.selectFrom(TABLE).selectAll().where('username', '=', username).execute(),

  findBySprintCode: async (sprintCode: string): Promise<RowSelect[]> =>
    db
      .selectFrom(TABLE)
      .selectAll()
      .where('sprintCode', '=', sprintCode)
      .execute(),

  create: async (record: RowInsert): Promise<RowSelect | undefined> =>
    db.insertInto(TABLE).values(record).returning(keys).executeTakeFirst(),
});
