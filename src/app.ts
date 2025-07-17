import 'dotenv/config';
import express from 'express';
import { Database } from './database';
import jsonErrorHandler from './middleware/jsonErrors';

export default function createApp(db: Database) {
  const { DISCORD_BOT_TOKEN } = process.env;
  if (!DISCORD_BOT_TOKEN) {
    throw new Error('Provide DISCORD_BOT_TOKEN in .env');
  }

  const app = express();

  app.use(express.json());

  app.use(jsonErrorHandler);

  return app;
}
