import express from 'express';
import { Database } from './database';
import jsonErrorHandler from './middleware/jsonErrors';
import sprints from '@/modules/sprints/controller';
import templates from '@/modules/templates/controller';
import messages from '@/modules/messages/controller';
import createDiscordClient from './utils/discord/createDiscordClient';

export default function createApp(db: Database) {
  const app = express();

  const client = createDiscordClient();

  app.use(express.json());

  app.use('/sprints', sprints(db));
  app.use('/templates', templates(db));
  app.use('/messages', messages(db, client));

  app.use(jsonErrorHandler);

  return app;
}
