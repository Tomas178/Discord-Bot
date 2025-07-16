import express from 'express';
import { Client, GatewayIntentBits } from 'discord.js';
import { Database } from './database';

export default function createApp(db: Database) {
  const app = express();

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  app.use(express.json());

  return app;
}
