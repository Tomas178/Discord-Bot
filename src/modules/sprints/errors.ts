import NotFound from '@/utils/errors/NotFound';

export class SprintAlreadyExists extends Error {
  constructor(sprintCode: string) {
    super(`Sprint with code "${sprintCode}" already exists.`);
  }
}

export class SprintNotFound extends NotFound {
  constructor(code: string) {
    super(`Sprint with code ${code} already exists`);
  }
}
