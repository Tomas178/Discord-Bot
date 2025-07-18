import { Templates } from '@/database';
import z, { record } from 'zod';
import {
  ERROR_EMPTY_TEMPLATE_MESSAGE,
  ERROR_TOO_LONG_TEMPLATE_MESSAGE,
  MAX_LENGTH,
} from './tests/utils/constants';

type Record = Templates;
const schema = z.object({
  id: z.coerce.number().int().positive(),
  templateMessage: z
    .string()
    .nonempty(ERROR_EMPTY_TEMPLATE_MESSAGE)
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
