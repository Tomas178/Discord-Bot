import { Sprints } from '@/database';
import z from 'zod';

type Record = Sprints;
const schema = z.object({
  id: z.coerce.number().int().positive(),
  sprintCode: z.string().regex(/^[A-Z]+-\d+\.\d+$/, {
    message:
      'Sprint code must match the pattern: Course-Module.Sprint (e.g., WD-1.1) ',
  }),
});

const insertable = schema.omit({
  id: true,
});

const updateable = schema
  .omit({
    id: true,
    sprintCode: true,
  })
  .partial();

export const parse = (record: unknown) => schema.parse(record);
export const parseId = (id: unknown) => schema.shape.id.parse(id);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parseUpdateable = (record: unknown) => updateable.parse(record);

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[];
