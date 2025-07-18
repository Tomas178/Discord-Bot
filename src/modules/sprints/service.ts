import { Database } from '@/database';
import buildModel, { RowInsert, RowUpdate } from './model';
import { SprintAlreadyExists, SprintNotFound } from './errors';

export default (db: Database) => {
  const sprints = buildModel(db);

  return {
    findAll: async () => sprints.findAll(),

    createSprint: async (data: RowInsert) => {
      const existing = await sprints.findBySprintCode(data.sprintCode);
      if (existing) {
        throw new SprintAlreadyExists(existing.sprintCode);
      }

      return sprints.create(data);
    },

    updateSprint: async (id: number, data: RowUpdate) => {
      const existing = await sprints.findById(id);
      if (!existing) {
        throw new SprintNotFound(id);
      }

      if (data.sprintCode) {
        const duplicate = await sprints.findBySprintCode(data.sprintCode);
        if (duplicate) {
          throw new SprintAlreadyExists(duplicate.sprintCode);
        }
      }

      return sprints.update(id, data);
    },

    removeSprint: async (id: number) => {
      const existing = await sprints.findById(id);
      if (!existing) {
        throw new SprintNotFound(id);
      }

      return sprints.remove(id);
    },
  };
};
