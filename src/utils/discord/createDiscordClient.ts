import { Client, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';
import { ERROR_NO_BOT_TOKEN } from './constants';

export default function createDiscordClient() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMembers,
    ],
  });

  const { DISCORD_BOT_TOKEN } = process.env;
  if (!DISCORD_BOT_TOKEN) {
    throw new Error(ERROR_NO_BOT_TOKEN);
  }

  client.on('ready', () => {
    console.log('Bot is ready!');
  });

  client.on('messageCreate', async (message) => {
    if (!message.author.bot) {
      return;
    }
    const taggedUser = message.mentions.users.first();

    try {
      await taggedUser?.send({
        content: message.content,
        embeds: message.embeds,
      });
    } catch (err) {
      console.error(`Failed to DM ${taggedUser}:`, err);
    }
  });

  process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
  });

  client.login(DISCORD_BOT_TOKEN);

  return client;
}
