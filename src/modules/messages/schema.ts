import { Messages } from '@/database';
import z from 'zod';
import {
  ERROR_EMPTY_MESSAGE,
  MAX_LENGTH_MESSAGE,
  ERROR_TOO_LONG_MESSAGE,
  ERROR_EMPTY_USERNAME,
  MAX_LENGTH_USERNAME,
  ERROR_TOO_LONG_USERNAME,
} from './tests/utils/constants';

const sprintCodeRegex = new RegExp(/^[A-Z]+-\d+\.\d+$/);
const sprintCodeErrorMessage =
  'Sprint code must match the pattern: Course-Module.Sprint (e.g., WD-1.1) ';

type Record = Messages;
const schema = z.object({
  id: z.coerce.number().int().positive(),
  message: z
    .string()
    .nonempty(ERROR_EMPTY_MESSAGE)
    .max(MAX_LENGTH_MESSAGE, ERROR_TOO_LONG_MESSAGE),
  sprintCode: z.string().regex(sprintCodeRegex, {
    message: sprintCodeErrorMessage,
  }),
  username: z
    .string()
    .nonempty(ERROR_EMPTY_USERNAME)
    .max(MAX_LENGTH_USERNAME, ERROR_TOO_LONG_USERNAME),
  createdAt: z.iso.datetime(),
});

const insertable = schema.omit({
  id: true,
  createdAt: true,
});

export const parse = (record: unknown) => schema.parse(record);
export const parseId = (id: unknown) => schema.shape.id.parse(id);

export const parseMessage = (message: unknown) =>
  schema.shape.message.parse(message);

export const parseUsername = (username: unknown) =>
  schema.shape.username.parse(username);

export const parseInsertable = (record: unknown) => insertable.parse(record);

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[];
