import { Database } from '@/database';
import { Router, Request } from 'express';
import buildService from './service';
import { jsonRoute, unsupportedRoute } from '@/utils/middleware';
import * as schema from './schema';
import { StatusCodes } from 'http-status-codes';
import { Client } from 'discord.js';
import sendMessageToDiscordServer from '@/utils/discord/sendMessageToDiscordServer';
import { ERROR_INSERTING_MESSAGE_TO_DATABASE } from './utils/constants';
import { GetRequest, PostRequest } from './utils/types';

export default (db: Database, discordClient: Client) => {
  const router = Router();
  const service = buildService(db);

  router
    .route('/')
    .get(
      jsonRoute(async (req: Request<{}, {}, {}, GetRequest>) => {
        if (req.query.username) {
          const username = schema.parseUsername(req.query.username);
          return service.findByUsername(username);
        }

        if (req.query.sprint) {
          const sprintCode = schema.parseSprintCode(req.query.sprint);
          return service.findBySprintCode(sprintCode);
        }

        return service.findAll();
      })
    )
    .post(
      jsonRoute(async (req: Request<{}, {}, PostRequest>) => {
        const { username, sprintCode } = schema.parseInsertable(req.body);

        let message: string;
        let gifUrl: string;

        try {
          const result = await service.formMessage(username, sprintCode);
          message = result.message;
          gifUrl = result.gifUrl;
        } catch (error) {
          throw error;
        }

        const formedMessage = {
          message,
          username,
          sprintCode,
          gifUrl,
        };

        await sendMessageToDiscordServer(
          message,
          gifUrl,
          username,
          discordClient
        );

        try {
          return await service.createMessage(formedMessage);
        } catch (_error) {
          throw new Error(ERROR_INSERTING_MESSAGE_TO_DATABASE);
        }
      }, StatusCodes.CREATED)
    )

    .all(unsupportedRoute);

  return router;
};
