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
        throw new SprintAlreadyExists(data.sprintCode);
      }

      return sprints.create(data);
    },

    updateSprint: async (sprintCode: string, data: RowUpdate) => {
      const existing = await sprints.findBySprintCode(sprintCode);
      if (!existing) {
        throw new SprintNotFound(sprintCode);
      }

      return sprints.update(sprintCode, data);
    },

    removeSprint: async (sprintCode: string) => {
      const existing = await sprints.findBySprintCode(sprintCode);
      if (!existing) {
        throw new SprintNotFound(sprintCode);
      }

      return sprints.remove(sprintCode);
    },
  };
};
