import { Messages } from '@/database';
import { INSERTABLE_SPRINTS } from '@/modules/sprints/tests/utils/constants';
import { Insertable } from 'kysely';

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
