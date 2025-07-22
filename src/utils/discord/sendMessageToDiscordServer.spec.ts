import sendMessageToDiscordServer from './sendMessageToDiscordServer';
import {
  Client,
  Guild,
  GuildMember,
  ChannelType,
  Collection,
  TextChannel,
  EmbedBuilder,
} from 'discord.js';
import { BotNotFound } from './errors';
import {
  ERROR_FAILED_TO_SEND_TO_DISCORD_CHANNEL,
  EMBED_COLOR,
} from './constants';
import { FAKE_GIPHY_URL } from '@/modules/messages/utils/constants';

const username = 'testUser';
const userId = '12345';
const message = `Hello ${username}`;
const finalMessage = `Hello <@${userId}>`;
const embed = new EmbedBuilder().setImage(FAKE_GIPHY_URL).setColor(EMBED_COLOR);

describe('Sad paths', () => {
  it('Should throw an error because of missing guilds', async () => {
    const mockClient = {
      guilds: {
        cache: new Collection(),
      },
    } as Client;

    await expect(
      sendMessageToDiscordServer(message, FAKE_GIPHY_URL, username, mockClient)
    ).rejects.toThrow(new BotNotFound());
  });

  it('Should return early if no textChannel has been found', async () => {
    const mockTextChannel = {
      type: ChannelType.GuildVoice,
    } as unknown as TextChannel;

    const mockFetchChannels = vi
      .fn()
      .mockResolvedValue(new Collection([['channel1', mockTextChannel]]));

    const mockGuild = {
      channels: {
        fetch: mockFetchChannels,
      },
      members: {
        fetch: vi.fn().mockResolvedValue(new Collection()),
      },
    } as unknown as Guild;

    const mockClient = {
      guilds: {
        cache: new Collection([['guild1', mockGuild]]),
      },
    } as Client;

    await sendMessageToDiscordServer(
      message,
      FAKE_GIPHY_URL,
      username,
      mockClient
    );

    expect(mockFetchChannels).toHaveBeenCalled();
    expect(mockGuild.members.fetch).not.toHaveBeenCalled();
  });

  it('Should throw an error if message fails to send', async () => {
    const mockSend = vi.fn().mockRejectedValue(new Error('Sending failed'));

    const mockTextChannel = {
      type: ChannelType.GuildText,
      send: mockSend,
    } as unknown as TextChannel;

    const mockFetchChannels = vi
      .fn()
      .mockResolvedValue(new Collection([['channel1', mockTextChannel]]));

    const mockMember = {
      displayName: username,
      id: userId,
    } as GuildMember;

    const mockFetchMembers = vi
      .fn()
      .mockResolvedValue(new Collection([['member1', mockMember]]));

    const mockGuild = {
      channels: {
        fetch: mockFetchChannels,
      },
      members: {
        fetch: mockFetchMembers,
      },
    } as unknown as Guild;

    const mockClient = {
      guilds: {
        cache: new Collection([['guild1', mockGuild]]),
      },
    } as unknown as Client;

    await expect(
      sendMessageToDiscordServer(message, FAKE_GIPHY_URL, username, mockClient)
    ).rejects.toThrow(ERROR_FAILED_TO_SEND_TO_DISCORD_CHANNEL);

    expect(mockSend).toHaveBeenCalledOnce();
  });
});

describe('Happy paths', () => {
  it('Shold send message without mention but with username', async () => {
    const mockSend = vi.fn().mockResolvedValue(undefined);

    const mockTextChannel = {
      type: ChannelType.GuildText,
      send: mockSend,
    } as unknown as TextChannel;

    const mockFetchChannels = vi
      .fn()
      .mockResolvedValue(new Collection([['channel1', mockTextChannel]]));

    const mockFetchMembers = vi.fn().mockResolvedValue(new Collection());

    const mockGuild = {
      channels: {
        fetch: mockFetchChannels,
      },
      members: {
        fetch: mockFetchMembers,
      },
    } as unknown as Guild;

    const mockClient = {
      guilds: {
        cache: new Collection([['guild1', mockGuild]]),
      },
    } as Client;

    await sendMessageToDiscordServer(
      message,
      FAKE_GIPHY_URL,
      username,
      mockClient
    );

    expect(mockSend).toBeCalledWith({
      content: message,
      embeds: [embed],
    });
    expect(mockSend).toHaveBeenCalledOnce();
  });

  it('Should send message successfully to one server', async () => {
    const mockSend = vi.fn().mockResolvedValue(undefined);

    const mockTextChannel = {
      type: ChannelType.GuildText,
      send: mockSend,
    } as unknown as TextChannel;

    const mockFetchChannels = vi
      .fn()
      .mockResolvedValue(new Collection([['channel1', mockTextChannel]]));

    const mockMember = {
      displayName: username,
      id: userId,
    } as GuildMember;

    const mockFetchMembers = vi
      .fn()
      .mockResolvedValue(new Collection([['member1', mockMember]]));

    const mockGuild = {
      channels: {
        fetch: mockFetchChannels,
      },
      members: {
        fetch: mockFetchMembers,
      },
    } as unknown as Guild;

    const mockClient = {
      guilds: {
        cache: new Collection([['guild1', mockGuild]]),
      },
    } as Client;

    await sendMessageToDiscordServer(
      message,
      FAKE_GIPHY_URL,
      username,
      mockClient
    );

    expect(mockSend).toBeCalledWith({
      content: finalMessage,
      embeds: [embed],
    });
    expect(mockSend).toHaveBeenCalledOnce();
  });

  it('Should send messages to multiple servers', async () => {
    const mockSend = vi.fn().mockResolvedValue(undefined);

    const mockTextChannel = {
      type: ChannelType.GuildText,
      send: mockSend,
    } as unknown as TextChannel;

    const mockFetchChannel = vi
      .fn()
      .mockResolvedValue(new Collection([['channel1', mockTextChannel]]));

    const mockMember = {
      displayName: username,
      id: userId,
    } as GuildMember;

    const mockFetchMembers = vi
      .fn()
      .mockResolvedValue(new Collection([['member1', mockMember]]));

    const mockGuild = {
      channels: {
        fetch: mockFetchChannel,
      },
      members: {
        fetch: mockFetchMembers,
      },
    } as unknown as Guild;

    const mockClient = {
      guilds: {
        cache: new Collection([
          ['guild1', mockGuild],
          ['guild2', mockGuild],
        ]),
      },
    } as Client;

    await sendMessageToDiscordServer(
      message,
      FAKE_GIPHY_URL,
      username,
      mockClient
    );

    expect(mockSend).toBeCalledWith({
      content: finalMessage,
      embeds: [embed],
    });
    expect(mockSend).toHaveBeenCalledTimes(2);
  });
});
