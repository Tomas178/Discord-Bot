import NotFound from '@/utils/errors/NotFound';

export class SprintNotFound extends NotFound {
  constructor(code: string) {
    super(`Sprint with code ${code} already exists`);
  }
}
