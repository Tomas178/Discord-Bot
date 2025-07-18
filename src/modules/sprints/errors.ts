import NotFound from '@/utils/errors/NotFound';
import { StatusCodes } from 'http-status-codes';

export class SprintAlreadyExists extends Error {
  status: number;

  constructor(sprintCode: string) {
    super(`Sprint with sprintCode "${sprintCode}" already exists.`);
    this.status = StatusCodes.CONFLICT;
  }
}

export class SprintNotFound extends NotFound {
  constructor(id: number) {
    super(`Sprint with id ${id} already exists`);
  }
}
