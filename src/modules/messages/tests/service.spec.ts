import createTestDatabase from '@tests/utils/createTestDatabase';
import buildService from '../service';
import { createFor, selectAllFor } from '@tests/utils/record';
import { INSERTABLE_MESSAGES } from './utils/constants';
import { fakeMessage, messageMatcher } from './utils/utils';
import { fakeTemplate } from '@/modules/templates/tests/utils/utils';
import { INSERTABLE_TEMPLATES } from '@/modules/templates/tests/utils/constants';
import { fakeSprint } from '@/modules/sprints/tests/utils/utils';
import { ERROR_NO_SPRINT, ERROR_NO_TEMPLATES } from './utils/constants';
import { formatTemplateMessage } from '../utils/formatTemplateMessage';
import NotFound from '@/utils/errors/NotFound';

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

describe('formMessage', () => {
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

    expect(message).toEqual(template.templateMessage);
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

    expect(formedMessage).toEqual(formedTemplateMessage);
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

    expect(formedMessage).toEqual(formedTemplateMessage);
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

    expect(formedMessage).toEqual(formedTemplateMessage);
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
