import { ChannelType, Client, EmbedBuilder, TextChannel } from 'discord.js';
import { BotNotFound } from './errors';
import {
  EMBED_COLOR,
  ERROR_FAILED_TO_SEND_TO_DISCORD_CHANNEL,
} from './constants';

export default async function (
  message: string,
  gifUrl: string,
  username: string,
  discordClient: Client
) {
  const guilds = discordClient.guilds.cache;
  if (guilds.size === 0) throw new BotNotFound();

  for (const guild of guilds.values()) {
    try {
      const channels = await guild.channels.fetch();
      const textChannel = channels.find(
        (ch): ch is TextChannel => ch?.type === ChannelType.GuildText
      );

      if (!textChannel) continue;

      const members = await guild.members.fetch();
      const discordUser = members.find(
        (m) => m.displayName.toLowerCase() === username.toLowerCase()
      );

      const mention = discordUser ? `<@${discordUser.id}>` : username;
      const finalMessage = message.replace(username, mention);
      const embed = new EmbedBuilder().setImage(gifUrl).setColor(EMBED_COLOR);

      await textChannel.send({ content: finalMessage, embeds: [embed] });
    } catch (err) {
      throw new Error(ERROR_FAILED_TO_SEND_TO_DISCORD_CHANNEL);
    }
  }
}
