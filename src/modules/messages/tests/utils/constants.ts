import { Messages } from '@/database';
import { INSERTABLE_SPRINTS } from '@/modules/sprints/tests/utils/constants';
import { Insertable } from 'kysely';

export const ERROR_EMPTY_MESSAGE = 'Message cannot be empty!';
export const ERROR_TOO_LONG_MESSAGE = 'Message too long!';
export const MAX_LENGTH_MESSAGE = 255;

export const MAX_LENGTH_USERNAME = 64;
export const ERROR_EMPTY_USERNAME = 'Username cannot be empty!';
export const ERROR_TOO_LONG_USERNAME = 'Username too long!';

export const INSERTABLE_MESSAGES: Insertable<Messages>[] = [
  {
    message: 'You did it Name',
    sprintCode: INSERTABLE_SPRINTS[0].sprintCode,
    username: 'Username',
  },
  {
    message: 'You did it BetterName',
    sprintCode: INSERTABLE_SPRINTS[1].sprintCode,
    username: 'BetterUsername',
  },
  {
    message: 'You did it EvenBetterName',
    sprintCode: INSERTABLE_SPRINTS[2].sprintCode,
    username: 'EvenBetterUsername',
  },
];
