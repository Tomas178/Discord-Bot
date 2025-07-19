import NotFound from '@/utils/errors/NotFound';
import { StatusCodes } from 'http-status-codes';

export class TemplateAlreadyExists extends Error {
  status: number;

  constructor(templateMessage: string) {
    super(`Template with this message: '${templateMessage}' already exists!`);
    this.status = StatusCodes.CONFLICT;
  }
}

export class TemplateNotFound extends NotFound {
  constructor(id: number) {
    super(`Template with id: ${id} not found!`);
  }
}
