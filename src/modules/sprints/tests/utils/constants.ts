type InsertableSprintRecord = {
  sprintCode: string;
  sprintTitle: string;
};

type UpdateableSprintRecord = {
  id: number;
  sprintCode: string;
  sprintTitle: string;
};

export const INSERTABLE_SPRINTS: InsertableSprintRecord[] = [
  {
    sprintCode: 'WD-1.1',
    sprintTitle: 'Python programming',
  },
  {
    sprintCode: 'WD-1.2',
    sprintTitle: 'Advanced Python programming',
  },
  {
    sprintCode: 'WD-2.1',
    sprintTitle: 'Very advanced Python programming',
  },
];

export const SPRINTS_FOR_UPDATE: UpdateableSprintRecord[] = [
  {
    id: 1,
    sprintCode: 'WD-1.7',
    sprintTitle: 'JavaScript programming',
  },
  {
    id: 2,
    sprintCode: 'WD-3.4',
    sprintTitle: 'Advanced JavaScript programming',
  },
  {
    id: 3,
    sprintCode: 'AI-2.4',
    sprintTitle: 'Very advanced JavaScript programming',
  },
];
