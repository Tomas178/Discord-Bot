vi.mock('discord.js', () => {
  return {
    Client: vi.fn().mockImplementation(() => ({
      on: vi.fn(),
      login: vi.fn(),
    })),
    GatewayIntentBits: {
      Guilds: 1,
      GuildMessages: 512,
      GuildMembers: 2,
    },
  };
});

import { Client } from 'discord.js';
import createDiscordClient from './createDiscordClient';
import { ERROR_NO_BOT_TOKEN } from './constants';

describe('createDiscordClient', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...OLD_ENV };
    vi.clearAllMocks();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('Should throw an error due to missing DISCORD_BOT_TOKEN', () => {
    delete process.env.DISCORD_BOT_TOKEN;

    expect(() => createDiscordClient()).toThrow(ERROR_NO_BOT_TOKEN);
  });

  it('Should create client, set listeners and call login with token', () => {
    process.env.DISCORD_BOT_TOKEN = 'fake-token';
    const client = createDiscordClient();

    expect(Client).toHaveBeenCalledOnce();
    expect(client.login).toHaveBeenCalledWith('fake-token');

    expect(client.on).toHaveBeenCalledWith('ready', expect.any(Function));
    expect(client.on).toHaveBeenCalledWith(
      'messageCreate',
      expect.any(Function)
    );
  });
});
