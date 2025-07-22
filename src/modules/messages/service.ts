import { Database } from '@/database';
import buildMessagesModel, { RowInsert } from './model';
import buildSprintsModel from '@/modules/sprints/model';
import buildTemplatesModel from '@/modules/templates/model';
import NotFound from '@/utils/errors/NotFound';
import { formatTemplateMessage } from './utils/formatTemplateMessage/formatTemplateMessage';
import { ERROR_NO_SPRINT, ERROR_NO_TEMPLATES } from './utils/constants';
import {
  MessageByIdNotFound,
  MessagesBySprintCodeNotFound,
  MessagesByUsernameAndSprintCodeNotFound,
  MessagesByUsernameNotFound,
} from './utils/errors';
import { fetchRandomCelebrationGif } from './utils/giphyClient/giphyClient';

export default (db: Database) => {
  const messages = buildMessagesModel(db);
  const sprints = buildSprintsModel(db);
  const templates = buildTemplatesModel(db);

  return {
    findAll: async () => messages.findAll(),

    findById: async (id: number) => {
      const message = await messages.findById(id);
      if (!message) throw new MessageByIdNotFound(id);

      return message;
    },

    findByUsernameAndSprintCode: async (
      username: string,
      sprintCode: string
    ) => {
      const messagesInDatabaseByUsername =
        await messages.findByUsername(username);

      if (messagesInDatabaseByUsername.length === 0) {
        throw new MessagesByUsernameNotFound(username);
      }

      const messagesInDatabaseBySprintCode =
        await messages.findBySprintCode(sprintCode);

      if (messagesInDatabaseBySprintCode.length === 0) {
        throw new MessagesBySprintCodeNotFound(sprintCode);
      }

      const messagesInDatabase = await messages.findByUsernameAndSprintCode(
        username,
        sprintCode
      );

      if (messagesInDatabase.length === 0) {
        throw new MessagesByUsernameAndSprintCodeNotFound(username, sprintCode);
      }

      return messagesInDatabase;
    },

    findByUsername: async (username: string) => {
      const messagesInDatabase = await messages.findByUsername(username);
      if (messagesInDatabase.length === 0) {
        throw new MessagesByUsernameNotFound(username);
      }

      return messagesInDatabase;
    },

    findBySprintCode: async (sprintCode: string) => {
      const messagesInDatabase = await messages.findBySprintCode(sprintCode);
      if (messagesInDatabase.length === 0) {
        throw new MessagesBySprintCodeNotFound(sprintCode);
      }

      return messagesInDatabase;
    },

    formMessage: async (username: string, sprintCode: string) => {
      const allTemplates = await templates.findAll();
      if (allTemplates.length === 0) {
        throw new NotFound(ERROR_NO_TEMPLATES);
      }

      const sprintExists = await sprints.findBySprintCode(sprintCode);
      if (!sprintExists) {
        throw new NotFound(ERROR_NO_SPRINT);
      }

      const randomIndex = Math.floor(Math.random() * allTemplates.length);
      const { templateMessage } = allTemplates[randomIndex];

      const { sprintTitle } = await sprints.getSprintTitle(sprintCode);

      const message = formatTemplateMessage(templateMessage, {
        username,
        sprintTitle,
      });

      const gifUrl = await fetchRandomCelebrationGif();

      return { message, gifUrl };
    },

    createMessage: async (data: RowInsert) => messages.create(data),
  };
};
