import { Sprints } from '@/database';
import z from 'zod';
import {
  ERROR_EMPTY_SPRINT_TITLE,
  sprintCodeErrorMessage,
  sprintCodeRegex,
} from './utils/constants';

type Record = Sprints;
const schema = z.object({
  id: z.coerce.number().int().positive(),
  sprintCode: z.string().regex(sprintCodeRegex, {
    message: sprintCodeErrorMessage,
  }),
  sprintTitle: z.string().nonempty(ERROR_EMPTY_SPRINT_TITLE),
});

const insertable = schema.omit({
  id: true,
});

const updateable = insertable.partial();

export const parse = (record: unknown) => schema.parse(record);
export const parseId = (id: unknown) => schema.shape.id.parse(id);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parseUpdateable = (record: unknown) => updateable.parse(record);

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[];
