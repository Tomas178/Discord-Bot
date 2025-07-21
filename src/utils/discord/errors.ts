import NotFound from '../errors/NotFound';
import { ERROR_BOT_NOT_FOUND } from './constants';

export class BotNotFound extends NotFound {
  constructor() {
    super(ERROR_BOT_NOT_FOUND);
  }
}
