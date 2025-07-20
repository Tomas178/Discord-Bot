import { Templates } from '@/database';
import z from 'zod';
import {
  ERROR_INVALID_TEMPLATE_MESSAGE,
  ERROR_TOO_LONG_TEMPLATE_MESSAGE,
  MAX_LENGTH,
  TEMPLATE_REGEX,
} from './utils/constants';

type Record = Templates;
const schema = z.object({
  id: z.coerce.number().int().positive(),
  templateMessage: z
    .string()
    .regex(TEMPLATE_REGEX, ERROR_INVALID_TEMPLATE_MESSAGE)
    .max(MAX_LENGTH, ERROR_TOO_LONG_TEMPLATE_MESSAGE),
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
