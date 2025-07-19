import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor, selectAllFor } from '@tests/utils/record';
import buildModel from '../model';
import { fakeMessage, messageMatcher } from './utils/utils';
import { INSERTABLE_MESSAGES } from './utils/constants';

const db = await createTestDatabase();
const model = buildModel(db);

const createMessages = createFor(db, 'messages');
const selectMessages = selectAllFor(db, 'messages');

afterAll(() => db.destroy());

afterEach(async () => db.deleteFrom('messages').execute());

describe('findAll', () => {
  it('Should return empty array', async () => {
    const messages = await model.findAll();

    expect(messages).toEqual([]);
  });

  it('Should return all existing messages', async () => {
    await createMessages(
      INSERTABLE_MESSAGES.map((message) => fakeMessage(message))
    );

    const messages = await model.findAll();

    expect(messages).toHaveLength(INSERTABLE_MESSAGES.length);
    expect(messages).toEqual(
      INSERTABLE_MESSAGES.map((message) => messageMatcher(message))
    );
  });
});

describe('create', () => {
  it('Should add one message', async () => {
    const message = await model.create(fakeMessage());

    expect(message).toEqual(messageMatcher());

    const messagesInDatabase = await selectMessages();
    expect(messagesInDatabase).toEqual([message]);
  });
});
