import { Database, Templates } from '@/database';
import { Insertable, Selectable, Updateable } from 'kysely';
import { keys } from './schema';

const TABLE = 'templates';
type Row = Templates;
type RowWithoutId = Omit<Row, 'id'>;
type RowInsert = Insertable<RowWithoutId>;
type RowUpdate = Updateable<RowWithoutId>;
type RowSelect = Selectable<Row>;

export default (db: Database) => ({
  findAll: async (): Promise<RowSelect[]> =>
    db.selectFrom(TABLE).selectAll().execute(),

  findById: async (id: number): Promise<RowSelect | undefined> =>
    db.selectFrom(TABLE).selectAll().where('id', '=', id).executeTakeFirst(),

  create: async (record: RowInsert): Promise<RowSelect | undefined> =>
    db.insertInto(TABLE).values(record).returning(keys).executeTakeFirst(),

  update: async (
    id: number,
    partial: RowUpdate
  ): Promise<RowSelect | undefined> => {
    if (Object.keys(partial).length === 0) {
      return db
        .selectFrom(TABLE)
        .select(keys)
        .where('id', '=', id)
        .executeTakeFirst();
    }

    return db
      .updateTable(TABLE)
      .set(partial)
      .where('id', '=', id)
      .returning(keys)
      .executeTakeFirst();
  },

  remove: async (id: number): Promise<RowSelect | undefined> =>
    db
      .deleteFrom(TABLE)
      .where('id', '=', id)
      .returning(keys)
      .executeTakeFirst(),
});
