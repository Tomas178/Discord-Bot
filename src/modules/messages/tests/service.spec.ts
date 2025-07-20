import createTestDatabase from '@tests/utils/createTestDatabase';
import buildService from '../service';
import { createFor, selectAllFor } from '@tests/utils/record';
import { INSERTABLE_MESSAGES } from './utils/constants';
import { fakeMessage, messageMatcher } from './utils/utils';
import { fakeTemplate } from '@/modules/templates/tests/utils/utils';
import { INSERTABLE_TEMPLATES } from '@/modules/templates/tests/utils/constants';
import { fakeSprint } from '@/modules/sprints/tests/utils/utils';
import { formatTemplateMessage } from '../utils/formatTemplateMessage/formatTemplateMessage';
import NotFound from '@/utils/errors/NotFound';
import { ERROR_NO_SPRINT, ERROR_NO_TEMPLATES } from '../utils/constants';
import {
  MessagesBySprintCodeNotFound,
  MessagesByUsernameNotFound,
} from '../errors';

const db = await createTestDatabase();
const service = buildService(db);

const createMessages = createFor(db, 'messages');
const selectMessages = selectAllFor(db, 'messages');

const createTemplates = createFor(db, 'templates');

const createSprints = createFor(db, 'sprints');

afterAll(() => db.destroy());

afterEach(async () => {
  db.deleteFrom('messages').execute();
  db.deleteFrom('templates').execute();
  db.deleteFrom('sprints').execute();
});

describe('findAll', () => {
  it('Should return all existing messages', async () => {
    await createMessages(
      INSERTABLE_MESSAGES.map((message) => fakeMessage(message))
    );

    const messages = await service.findAll();

    expect(messages).toHaveLength(INSERTABLE_MESSAGES.length);
    expect(messages).toEqual(
      INSERTABLE_MESSAGES.map((message) => messageMatcher(message))
    );
  });
});

describe('findByUsername', () => {
  it('Should throw a MessagesByUsernameNotFound', async () => {
    const username = 'username';

    await expect(service.findByUsername(username)).rejects.toThrow(
      new MessagesByUsernameNotFound(username)
    );
  });

  it('Should return one message', async () => {
    await createMessages(
      INSERTABLE_MESSAGES.map((message) => fakeMessage(message))
    );

    const messages = await service.findByUsername(
      INSERTABLE_MESSAGES[0].username
    );

    expect(messages).toHaveLength(1);
    expect(messages).toEqual([messageMatcher(INSERTABLE_MESSAGES[0])]);
  });

  it('Should return all messages', async () => {
    await createMessages(
      INSERTABLE_MESSAGES.map((message) => fakeMessage(message))
    );

    await createMessages(
      fakeMessage({
        username: INSERTABLE_MESSAGES[1].username,
      })
    );

    const messages = await service.findByUsername(
      INSERTABLE_MESSAGES[1].username
    );

    expect(messages).toHaveLength(2);
    expect(messages[0]).toEqual(messageMatcher(INSERTABLE_MESSAGES[1]));
    expect(messages[1]).toEqual(
      messageMatcher({
        username: INSERTABLE_MESSAGES[1].username,
      })
    );
  });
});

describe('findBySprintCode', () => {
  it('Should throw a MessagesBySprintCodeNotFound', async () => {
    const sprintCode = 'WD-1.1';

    await expect(service.findBySprintCode(sprintCode)).rejects.toThrow(
      new MessagesBySprintCodeNotFound(sprintCode)
    );
  });

  it('Should return one message', async () => {
    await createMessages(
      INSERTABLE_MESSAGES.map((message) => fakeMessage(message))
    );

    const messages = await service.findBySprintCode(
      INSERTABLE_MESSAGES[0].sprintCode
    );

    expect(messages).toHaveLength(1);
    expect(messages).toEqual([messageMatcher(INSERTABLE_MESSAGES[0])]);
  });

  it('Should return all messages', async () => {
    await createMessages(
      INSERTABLE_MESSAGES.map((message) => fakeMessage(message))
    );

    await createMessages(
      fakeMessage({
        sprintCode: INSERTABLE_MESSAGES[1].sprintCode,
      })
    );

    const messages = await service.findBySprintCode(
      INSERTABLE_MESSAGES[1].sprintCode
    );

    expect(messages).toHaveLength(2);
    expect(messages[0]).toEqual(messageMatcher(INSERTABLE_MESSAGES[1]));
    expect(messages[1]).toEqual(
      messageMatcher({
        sprintCode: INSERTABLE_MESSAGES[1].sprintCode,
      })
    );
  });
});

describe('formMessage', () => {
  beforeAll(() => {
    vi.mock('../utils/giphyClient/giphyClient', () => ({
      fetchRandomCelebrationGif: vi.fn(() =>
        Promise.resolve('https://giphy.com/fake.gif')
      ),
    }));
  });

  it('Should throw a NotFound if no templates exist', async () => {
    await expect(service.formMessage('', 'TP-1.1')).rejects.toThrow(
      new NotFound(ERROR_NO_TEMPLATES)
    );
  });

  it('Should throw a NotFound if no sprint exist', async () => {
    await createTemplates(fakeTemplate());

    await expect(service.formMessage('', 'TP-1.1')).rejects.toThrow(
      new NotFound(ERROR_NO_SPRINT)
    );
  });

  it('Should form message which has no {username} or {sprintTitle}', async () => {
    const [template] = await createTemplates(fakeTemplate());

    const [sprint] = await createSprints(fakeSprint());

    const message = await service.formMessage('', sprint.sprintCode);

    expect(message.message).toEqual(template.templateMessage);
    expect(message.gifUrl).toBe('https://giphy.com/fake.gif');
  });

  it('Should form message which has only {username}', async () => {
    const [template] = await createTemplates(
      fakeTemplate(INSERTABLE_TEMPLATES[0])
    );

    const [sprint] = await createSprints(fakeSprint());

    const username = INSERTABLE_MESSAGES[0].username;

    const formedTemplateMessage = formatTemplateMessage(
      template.templateMessage,
      {
        username,
      }
    );

    const formedMessage = await service.formMessage(
      username,
      sprint.sprintCode
    );

    expect(formedMessage.message).toEqual(formedTemplateMessage);
    expect(formedMessage.gifUrl).toBe('https://giphy.com/fake.gif');
  });

  it('Should form message which has only {sprintTitle}', async () => {
    const [template] = await createTemplates(
      fakeTemplate(INSERTABLE_TEMPLATES[1])
    );

    const [sprint] = await createSprints(fakeSprint());

    const username = INSERTABLE_MESSAGES[1].username;
    const sprintTitle = sprint.sprintTitle;
    const sprintCode = sprint.sprintCode;

    const formedTemplateMessage = formatTemplateMessage(
      template.templateMessage,
      {
        sprintTitle,
      }
    );

    const formedMessage = await service.formMessage(username, sprintCode);

    expect(formedMessage.message).toEqual(formedTemplateMessage);
    expect(formedMessage.gifUrl).toBe('https://giphy.com/fake.gif');
  });

  it('Should form message which has {username} and {sprintTitle}', async () => {
    const [template] = await createTemplates(
      fakeTemplate(INSERTABLE_TEMPLATES[2])
    );

    const [sprint] = await createSprints(fakeSprint());

    const username = INSERTABLE_MESSAGES[2].username;
    const sprintTitle = sprint.sprintTitle;
    const sprintCode = sprint.sprintCode;

    const formedTemplateMessage = formatTemplateMessage(
      template.templateMessage,
      {
        username,
        sprintTitle,
      }
    );

    const formedMessage = await service.formMessage(username, sprintCode);

    expect(formedMessage.message).toEqual(formedTemplateMessage);
    expect(formedMessage.gifUrl).toBe('https://giphy.com/fake.gif');
  });
});

describe('createMessage', () => {
  it('Should create a message', async () => {
    const addedMessage = await service.createMessage(fakeMessage());

    expect(addedMessage).toEqual(messageMatcher());

    const messageInDatabase = await selectMessages();

    expect(messageInDatabase).toEqual([addedMessage]);
  });
});
