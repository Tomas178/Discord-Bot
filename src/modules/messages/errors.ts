import NotFound from '@/utils/errors/NotFound';

export class MessagesByUsernameNotFound extends NotFound {
  constructor(username: string) {
    super(`Messages with username: ${username} not found!`);
  }
}

export class MessagesBySprintCodeNotFound extends NotFound {
  constructor(sprintCode: string) {
    super(`Messages with sprintCode: ${sprintCode} not found!`);
  }
}
