import { Database, Messages } from '@/database';
import { Insertable, Selectable } from 'kysely';
import { keys } from './schema';

const TABLE = 'messages';
type Row = Messages;
type RowWithoutIdAndCreatedAt = Omit<Row, 'id' | 'createdAt'>;
export type RowInsert = Insertable<RowWithoutIdAndCreatedAt>;
type RowSelect = Selectable<RowWithoutIdAndCreatedAt>;

export default (db: Database) => ({
  findAll: async (): Promise<RowSelect[]> =>
    db.selectFrom(TABLE).selectAll().execute(),

  create: async (record: RowInsert): Promise<RowSelect | undefined> =>
    db.insertInto(TABLE).values(record).returning(keys).executeTakeFirst(),
});
