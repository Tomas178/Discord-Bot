type InsertableSprintRecord = {
  sprintCode: string;
};

type SprintCode = string;

export const INSERTABLE_SPRINTS: InsertableSprintRecord[] = [
  {
    sprintCode: 'WD-1.1',
  },
  {
    sprintCode: 'WD-1.2',
  },
  {
    sprintCode: 'WD-2.1',
  },
];

export const SPRINT_CODES_FOR_UPDATE: SprintCode[] = [
  'WD-2.5',
  'WD-3.4',
  'AI-2.4',
];
