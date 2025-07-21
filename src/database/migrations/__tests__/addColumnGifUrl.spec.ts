import createTestDatabase from '@tests/utils/createTestDatabase';
import { down } from '../20250720164415-addColumnGifUrl';
import { SqliteDatabase, Kysely } from 'kysely';

const db = await createTestDatabase();

it('Should throw an error when querying dropped gif_url column', async () => {
  await down(db as unknown as Kysely<SqliteDatabase>);

  let error: unknown;

  try {
    await db.selectFrom('messages').select(['gifUrl']).execute();
  } catch (err) {
    error = err;
  }

  expect(error).toBeDefined();
  expect((error as Error).message).toMatch(/no such column: "gif_url"/i);
});
