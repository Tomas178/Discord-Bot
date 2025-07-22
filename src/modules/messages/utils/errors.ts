import NotFound from '@/utils/errors/NotFound';

export class MessageByIdNotFound extends NotFound {
  constructor(id: number) {
    super(`Message with id: ${id} not found!`);
  }
}

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

export class GifNotFound extends NotFound {
  constructor() {
    super('No celebration GIFs found!');
  }
}

export class MessagesByUsernameAndSprintCodeNotFound extends NotFound {
  constructor(username: string, sprintCode: string) {
    super(
      `Messages with username: ${username} and sprintCode: ${sprintCode} not found!`
    );
  }
}
