import { Database } from '@/database';
import buildService from './service';
import { Router } from 'express';
import { jsonRoute, unsupportedRoute } from '@/utils/middleware';
import * as schema from './schema';
import { StatusCodes } from 'http-status-codes';
import BadRequest from '@/utils/errors/BadRequest';
import { ERROR_PATCH_REQUEST } from './utils/constants';

export default (db: Database) => {
  const router = Router();
  const service = buildService(db);

  router
    .route('/')
    .get(jsonRoute(service.findAll))
    .post(
      jsonRoute(async (req) => {
        const body = schema.parseInsertable(req.body);

        return service.createSprint(body);
      }, StatusCodes.CREATED)
    )
    .patch(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.query.id);
        const body = schema.parseUpdateable(req.body);

        if (!body.sprintCode && !body.sprintTitle) {
          throw new BadRequest(ERROR_PATCH_REQUEST);
        }

        return service.updateSprint(id, {
          sprintCode: body.sprintCode,
          sprintTitle: body.sprintTitle,
        });
      }, StatusCodes.OK)
    )
    .delete(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.query.id);

        return service.removeSprint(id);
      })
    )
    .all(unsupportedRoute);

  return router;
};
