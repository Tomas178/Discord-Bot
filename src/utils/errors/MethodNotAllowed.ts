import { StatusCodes } from 'http-status-codes';

export default class MethodNotAllowed extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.status = StatusCodes.METHOD_NOT_ALLOWED;
  }
}
