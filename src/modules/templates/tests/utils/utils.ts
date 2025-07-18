import { Templates } from '@/database';
import { Insertable } from 'kysely';

export const fakeTemplate = (
  overrides: Partial<Insertable<Templates>> = {}
): Insertable<Templates> => ({
  templateMessage: 'You nailed it! 💪',
  ...overrides,
});

export const templateMatcher = (
  overrides: Partial<Insertable<Templates>> = {}
) => ({
  id: expect.any(Number),
  ...overrides,
  ...fakeTemplate(overrides),
});

export const fakeTemplateFull = (
  overrides: Partial<Insertable<Templates>> = {}
): Insertable<Templates> => ({
  id: 2,
  ...fakeTemplate(),
});
