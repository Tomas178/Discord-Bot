import { Database } from '@/database';
import buildMessagesModel, { RowInsert } from './model';
import buildSprintsModel from '@/modules/sprints/model';
import buildTemplatesModel from '@/modules/templates/model';
import NotFound from '@/utils/errors/NotFound';
import { formatTemplateMessage } from './utils/formatTemplateMessage';
import { ERROR_NO_SPRINT, ERROR_NO_TEMPLATES } from './tests/utils/constants';

export default (db: Database) => {
  const messages = buildMessagesModel(db);
  const sprints = buildSprintsModel(db);
  const templates = buildTemplatesModel(db);

  return {
    findAll: async () => messages.findAll(),

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

      const formedMessage = formatTemplateMessage(templateMessage, {
        username,
        sprintTitle,
      });

      return formedMessage;
    },

    createMessage: async (data: RowInsert) => messages.create(data),
  };
};
