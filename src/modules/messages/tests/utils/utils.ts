import { Messages } from '@/database';
import { Insertable } from 'kysely';

export const fakeMessage = (
  overrides: Partial<Insertable<Messages>> = {}
): Insertable<Messages> => ({
  message: 'Congrats Tomas!',
  sprintCode: 'WD-1.1',
  gifUrl: 'https://giphy.com/fake.gif',
  username: 'username',
  ...overrides,
});

export const messageMatcher = (
  overrides: Partial<Insertable<Messages>> = {}
) => ({
  id: expect.any(Number),
  createdAt: expect.any(String),
  ...fakeMessage(overrides),
});

export const fakeMessageFull = (
  overrides: Partial<Insertable<Messages>> = {}
) => ({
  id: 2,
  createdAt: new Date(2025, 6, 19).toISOString(),
  ...fakeMessage(overrides),
});
