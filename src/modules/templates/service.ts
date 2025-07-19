import { Database } from '@/database';
import buildModel, { RowInsert, RowUpdate } from './model';
import { TemplateAlreadyExists, TemplateNotFound } from './errors';

export default (db: Database) => {
  const templates = buildModel(db);

  return {
    findAll: async () => templates.findAll(),

    createTemplate: async (data: RowInsert) => {
      const existing = await templates.findByTemplateMessage(
        data.templateMessage
      );
      if (existing) {
        throw new TemplateAlreadyExists(existing.templateMessage);
      }

      return templates.create(data);
    },

    updateTemplate: async (id: number, data: RowUpdate) => {
      const existing = await templates.findById(id);
      if (!existing) {
        throw new TemplateNotFound(id);
      }

      if (data.templateMessage) {
        const duplicate = await templates.findByTemplateMessage(
          data.templateMessage
        );
        if (duplicate) {
          throw new TemplateAlreadyExists(duplicate.templateMessage);
        }
      }

      return templates.update(id, data);
    },

    removeTemplate: async (id: number) => {
      const existing = await templates.findById(id);
      if (!existing) {
        throw new TemplateNotFound(id);
      }

      return templates.remove(id);
    },
  };
};
