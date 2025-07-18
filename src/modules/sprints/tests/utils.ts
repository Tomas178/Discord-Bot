import { Sprints } from '@/database';
import { Insertable } from 'kysely';

export const fakeSprint = (
  overrides: Partial<Insertable<Sprints>> = {}
): Insertable<Sprints> => ({
  sprintCode: 'WD-1.1',
  ...overrides,
});

export const sprintMatcher = (
  overrides: Partial<Insertable<Sprints>> = {}
) => ({
  id: expect.any(Number),
  ...overrides,
  ...fakeSprint(overrides),
});

export const fakeSprintFull = (
  overrides: Partial<Insertable<Sprints>> = {}
) => ({
  id: 2,
  ...fakeSprint(overrides),
});
