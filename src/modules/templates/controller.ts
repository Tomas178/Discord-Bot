import { Database } from '@/database';
import { Router } from 'express';
import buildService from './service';
import { jsonRoute, unsupportedRoute } from '@/utils/middleware';
import * as schema from './schema';
import { StatusCodes } from 'http-status-codes';
import BadRequest from '@/utils/errors/BadRequest';
import { ERROR_MISSING_TEMPLATE_MESSAGE } from './utils/constants';

export default (db: Database) => {
  const router = Router();
  const service = buildService(db);

  router
    .route('/')
    .get(jsonRoute(service.findAll))
    .post(
      jsonRoute(async (req) => {
        const body = schema.parseInsertable(req.body);

        return service.createTemplate(body);
      }, StatusCodes.CREATED)
    )
    .patch(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.query.id);
        const body = schema.parseUpdateable(req.body);

        if (!body.templateMessage) {
          throw new BadRequest(ERROR_MISSING_TEMPLATE_MESSAGE);
        }

        return service.updateTemplate(id, body);
      })
    )
    .delete(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.query.id);

        return service.removeTemplate(id);
      })
    )
    .all(unsupportedRoute);

  router
    .route('/:id')
    .get(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);

        return service.findById(id);
      })
    )
    .patch(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);
        const body = schema.parseUpdateable(req.body);

        if (!body.templateMessage) {
          throw new BadRequest(ERROR_MISSING_TEMPLATE_MESSAGE);
        }

        return service.updateTemplate(id, body);
      })
    )
    .delete(
      jsonRoute(async (req) => {
        const id = schema.parseId(req.params.id);

        return service.removeTemplate(id);
      })
    )
    .all(unsupportedRoute);

  return router;
};
