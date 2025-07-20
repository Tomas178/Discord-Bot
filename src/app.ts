import 'dotenv/config';
import express from 'express';
import { Client, GatewayIntentBits } from 'discord.js';
import { Database } from './database';
import jsonErrorHandler from './middleware/jsonErrors';
import sprints from '@/modules/sprints/controller';
import templates from '@/modules/templates/controller';
import messages from '@/modules/messages/controller';

export default function createApp(db: Database) {
  const { DISCORD_BOT_TOKEN } = process.env;
  if (!DISCORD_BOT_TOKEN) {
    throw new Error('Provide DISCORD_BOT_TOKEN in .env');
  }

  const app = express();

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      // GatewayIntentBits.MessageContent,
    ],
  });

  app.use(express.json());

  app.use('/sprints', sprints(db));
  app.use('/templates', templates(db));
  app.use('/messages', messages(db));

  app.use(jsonErrorHandler);

  client.login(DISCORD_BOT_TOKEN);

  return app;
}
