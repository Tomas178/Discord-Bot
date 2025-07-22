import { Messages } from '@/database';
import z from 'zod';
import {
  ERROR_EMPTY_MESSAGE,
  ERROR_EMPTY_USERNAME,
  ERROR_TOO_LONG_MESSAGE,
  ERROR_TOO_LONG_USERNAME,
  MAX_LENGTH_MESSAGE,
  MAX_LENGTH_USERNAME,
} from './utils/constants';
import {
  ERROR_INVALID_SPRINTCODE,
  sprintCodeRegex,
} from '../sprints/utils/constants';

type Record = Messages;
const schema = z.object({
  id: z.coerce.number().int().positive(),
  message: z
    .string()
    .nonempty(ERROR_EMPTY_MESSAGE)
    .max(MAX_LENGTH_MESSAGE, ERROR_TOO_LONG_MESSAGE),
  sprintCode: z.string().regex(sprintCodeRegex, ERROR_INVALID_SPRINTCODE),
  username: z
    .string()
    .nonempty(ERROR_EMPTY_USERNAME)
    .max(MAX_LENGTH_USERNAME, ERROR_TOO_LONG_USERNAME),
  gifUrl: z.url(),
  createdAt: z.iso.datetime(),
});

const insertable = schema.pick({
  sprintCode: true,
  username: true,
});

const getQuery = z.object({
  username: schema.shape.username.optional(),
  sprint: schema.shape.sprintCode.optional(),
});

export const parse = (record: unknown) => schema.parse(record);
export const parseId = (id: unknown) => schema.shape.id.parse(id);

export const parseMessage = (message: unknown) =>
  schema.shape.message.parse(message);

export const parseUsername = (username: unknown) =>
  schema.shape.username.parse(username);

export const parseSprintCode = (sprintCode: unknown) =>
  schema.shape.sprintCode.parse(sprintCode);

export const parseInsertable = (record: unknown) => insertable.parse(record);

export const parseGetQuery = (record: unknown) => {
  const parsed = getQuery.parse(record);
  return {
    username: parsed.username,
    sprintCode: parsed.sprint,
  };
};

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[];
