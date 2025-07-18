type InsertableSprintRecord = {
  sprintCode: string;
};

type UpdateableSprintRecord = {
  id: number;
  sprintCode: string;
};

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

export const SPRINTS_FOR_UPDATE: UpdateableSprintRecord[] = [
  {
    id: 1,
    sprintCode: 'WD-1.7',
  },
  {
    id: 2,
    sprintCode: 'WD-3.4',
  },
  {
    id: 3,
    sprintCode: 'AI-2.4',
  },
];
