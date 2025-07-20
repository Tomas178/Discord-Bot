import { Database } from '@/database';
import { Router, Request } from 'express';
import buildService from './service';
import { jsonRoute } from '@/utils/middleware';
import * as schema from './schema';
import { StatusCodes } from 'http-status-codes';

type PostRequest = {
  username: string;
  sprintCode: string;
};

export default (db: Database) => {
  const router = Router();
  const service = buildService(db);

  router
    .route('/')
    .get(jsonRoute(service.findAll))
    .post(
      jsonRoute(async (req: Request<{}, {}, PostRequest>) => {
        const { username, sprintCode } = schema.parseInsertable(req.body);
        const message = await service.formMessage(username, sprintCode);

        const formedMessage = {
          message,
          username,
          sprintCode,
        };

        return service.createMessage(formedMessage);
      }, StatusCodes.CREATED)
    );

  return router;
};
