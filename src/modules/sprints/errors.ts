import NotFound from '@/utils/errors/NotFound';
import { StatusCodes } from 'http-status-codes';

export class SprintAlreadyExists extends Error {
  status: number;

  constructor(sprintCode: string) {
    super(`Sprint with code "${sprintCode}" already exists.`);
    this.status = StatusCodes.CONFLICT;
  }
}

export class SprintNotFound extends NotFound {
  constructor(code: string) {
    super(`Sprint with code ${code} already exists`);
  }
}
