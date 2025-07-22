vi.mock('@/modules/messages/utils/giphyClient/giphyClient', async () => ({
  fetchRandomCelebrationGif: vi
    .fn()
    .mockResolvedValue('https://giphy.com/fake.gif'),
}));

vi.mock('@/utils/discord/sendMessageToDiscordServer', () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

import createTestDatabase from '@tests/utils/createTestDatabase';
import createApp from '@/app';
import { createFor } from '@tests/utils/record';
import supertest from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { INSERTABLE_MESSAGES } from './utils/constants';
import { fakeMessage, messageMatcher } from './utils/utils';
import { omit } from 'lodash/fp';
import { fakeTemplate } from '@/modules/templates/tests/utils/utils';
import { fakeSprint } from '@/modules/sprints/tests/utils/utils';
import { formatTemplateMessage } from '../utils/formatTemplateMessage/formatTemplateMessage';
import {
  ERROR_INSERTING_MESSAGE_TO_DATABASE,
  ERROR_NO_SPRINT,
  FAKE_GIPHY_URL,
} from '../utils/constants';

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

describe('Route /messages', () => {
  describe('GET', () => {
    describe('No query', () => {
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

    describe('Query for username and sprint', () => {
      it('Should return 404 if messages for the given username are not found', async () => {
        const { body } = await supertest(app)
          .get('/messages?username=Tomas&sprint=WD-1.1')
          .expect(StatusCodes.NOT_FOUND);

        expect(body.error.message).toMatch(/Messages with username/);
      });

      it('Should return 404 if messages for the given sprint are not found', async () => {
        const [createdMessage] = await createMessages(
          fakeMessage({ sprintCode: 'WD-1.1' })
        );

        const username = createdMessage.username;
        const invalidSprint = 'WD-1.2';

        const { body } = await supertest(app)
          .get(`/messages?username=${username}&sprint=${invalidSprint}`)
          .expect(StatusCodes.NOT_FOUND);

        expect(body.error.message).toMatch(/Messages with sprintCode/);
      });

      it('Should return 404 if messages for the given username and sprint are not found', async () => {
        const [firstCreatedMessage] = await createMessages(
          fakeMessage({
            sprintCode: 'WD-1.1',
          })
        );

        const [secondCreatedMessage] = await createMessages(
          fakeMessage({
            username: firstCreatedMessage.username + 'a',
            sprintCode: 'WD-1.2',
          })
        );

        const firstMessageUsername = firstCreatedMessage.username;
        const secondMessageSprintCode = secondCreatedMessage.sprintCode;

        const { body } = await supertest(app)
          .get(
            `/messages?username=${firstMessageUsername}&sprint=${secondMessageSprintCode}`
          )
          .expect(StatusCodes.NOT_FOUND);

        expect(body.error.message).toMatch(
          `Messages with username: ${firstMessageUsername} and sprintCode: ${secondMessageSprintCode}`
        );
      });

      it('Should return 200 and all messages', async () => {
        const [createdMessage] = await createMessages(fakeMessage());

        const username = createdMessage.username;
        const sprint = createdMessage.sprintCode;

        const { body } = await supertest(app)
          .get(`/messages?username=${username}&sprint=${sprint}`)
          .expect(StatusCodes.OK);

        expect(body).toEqual([messageMatcher()]);
      });
    });

    describe('Query for username', () => {
      it('Should return 404 if messages for the given username are not found', async () => {
        const { body } = await supertest(app)
          .get('/messages?username=Tomas')
          .expect(StatusCodes.NOT_FOUND);

        expect(body.error.message).toMatch(/Messages with username/);
      });

      it('Should return 200 and messages with given username', async () => {
        await createMessages(
          INSERTABLE_MESSAGES.map((message) => fakeMessage(message))
        );

        const { body } = await supertest(app)
          .get(`/messages?username=${INSERTABLE_MESSAGES[0].username}`)
          .expect(StatusCodes.OK);

        expect(body).toEqual([messageMatcher(INSERTABLE_MESSAGES[0])]);
      });
    });

    describe('Query for sprint', () => {
      it('Should return 404 if messages for the given sprint are not found', async () => {
        const { body } = await supertest(app)
          .get('/messages?sprint=WD-1.1')
          .expect(StatusCodes.NOT_FOUND);

        expect(body.error.message).toMatch(/Messages with sprintCode/);
      });

      it('Should return 200 and messages with given sprint', async () => {
        await createMessages(
          INSERTABLE_MESSAGES.map((message) => fakeMessage(message))
        );

        const { body } = await supertest(app)
          .get(`/messages?sprint=${INSERTABLE_MESSAGES[0].sprintCode}`)
          .expect(StatusCodes.OK);

        expect(body).toEqual([messageMatcher(INSERTABLE_MESSAGES[0])]);
      });
    });
  });

  describe('POST', () => {
    it('Should return 500 in case of insertion to database error', async () => {
      vi.resetModules();

      vi.doMock('../service', () => {
        return {
          default: () => ({
            createMessage: vi.fn().mockRejectedValue(new Error()),
            formMessage: vi.fn().mockResolvedValue({
              message: 'message',
              gifUrl: FAKE_GIPHY_URL,
            }),
          }),
        };
      });

      const createApp = (await import('@/app')).default;

      const db = await createTestDatabase();
      const app = createApp(db);

      const [sprint] = await createSprints(fakeSprint());

      const messageObject = {
        username: 'name',
        sprintCode: sprint.sprintCode,
      };

      const { body } = await supertest(app)
        .post('/messages')
        .send(messageObject)
        .expect(StatusCodes.INTERNAL_SERVER_ERROR);

      expect(body.error.message).toBe(ERROR_INSERTING_MESSAGE_TO_DATABASE);
    });

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

      const formedMessage = formatTemplateMessage(template.templateMessage, {
        username: 'name',
        sprintTitle: 'Python programming',
      });

      const formedMessageObject = {
        message: formedMessage,
        ...messageObject,
      };

      expect(body).toEqual(messageMatcher(formedMessageObject));
    });
  });
});

describe('Route /messages/:id', () => {
  describe('GET', () => {
    it('Should return 404 and throw an error MessageByIdNotFound', async () => {
      const { body } = await supertest(app)
        .get('/messages/999')
        .expect(StatusCodes.NOT_FOUND);

      expect(body.error.message).toMatch(/Message with id/i);
    });

    it('Should return 200 and message by given id', async () => {
      const [message] = await createMessages(fakeMessage());

      const { body } = await supertest(app)
        .get(`/messages/${message.id}`)
        .expect(StatusCodes.OK);

      expect(body).toStrictEqual(message);
    });
  });
});
