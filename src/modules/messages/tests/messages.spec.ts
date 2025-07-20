import createTestDatabase from '@tests/utils/createTestDatabase';
import buildService from '../service';
import createApp from '@/app';
import { createFor } from '@tests/utils/record';
import supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { INSERTABLE_MESSAGES } from './utils/constants';
import { fakeMessage, messageMatcher } from './utils/utils';
import { omit } from 'lodash/fp';
import { fakeTemplate } from '@/modules/templates/tests/utils/utils';
import { fakeSprint } from '@/modules/sprints/tests/utils/utils';
import { formatTemplateMessage } from '../utils/formatTemplateMessage';
import { ERROR_NO_SPRINT } from '../utils/constants';

const db = await createTestDatabase();
const app = createApp(db);

const createMessages = createFor(db, 'messages');
const createTemplates = createFor(db, 'templates');
const createSprints = createFor(db, 'sprints');

afterAll(() => db.destroy());

afterEach(async () => {
  db.deleteFrom('messages').execute();
  db.deleteFrom('templates').execute();
  db.deleteFrom('sprints').execute();
});

describe('GET', () => {
  it('Should return 200 and an empty array when there are no messages', async () => {
    const { body } = await supertest(app)
      .get('/messages')
      .expect(StatusCodes.OK);

    expect(body).toEqual([]);
  });

  it('Should return 200 and all messages', async () => {
    await createMessages(
      INSERTABLE_MESSAGES.map((message) => fakeMessage(message))
    );

    const { body } = await supertest(app)
      .get('/messages')
      .expect(StatusCodes.OK);

    expect(body).toHaveLength(INSERTABLE_MESSAGES.length);
    expect(body).toEqual(
      INSERTABLE_MESSAGES.map((message) => messageMatcher(message))
    );
  });
});

describe('POST', () => {
  it('Should return 400 if the username is missing', async () => {
    const { body } = await supertest(app)
      .post('/messages')
      .send(omit(['username'], fakeMessage()))
      .expect(StatusCodes.BAD_REQUEST);

    expect(body.error.message).toMatch(/username/i);
  });

  it('Should return 400 if the sprintCode is missing', async () => {
    const { body } = await supertest(app)
      .post('/messages')
      .send(omit(['sprintCode'], fakeMessage()))
      .expect(StatusCodes.BAD_REQUEST);

    expect(body.error.message).toMatch(/sprintCode/i);
  });

  it('Should return 404 if the sprint does not exist', async () => {
    await createTemplates(fakeTemplate());

    const { body } = await supertest(app)
      .post('/messages')
      .send(fakeMessage())
      .expect(StatusCodes.NOT_FOUND);

    expect(body.error.message).toMatch(ERROR_NO_SPRINT);
  });

  it('Should return 201 and post message', async () => {
    const [template] = await createTemplates(fakeTemplate());

    const [sprint] = await createSprints(fakeSprint());

    const messageObject = {
      username: 'name',
      sprintCode: sprint.sprintCode,
    };

    const { body } = await supertest(app)
      .post('/messages')
      .send(messageObject)
      .expect(StatusCodes.CREATED);

    const formedMessage = formatTemplateMessage(
      template.templateMessage,
      messageObject
    );

    const formedMessageObject = {
      message: formedMessage,
      ...messageObject,
    };

    expect(body).toEqual(messageMatcher(formedMessageObject));
  });
});
