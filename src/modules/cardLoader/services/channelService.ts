import { Guild, TextChannel } from "discord.js";

export const getChannelById = async (guild: Guild, channelId: string): Promise<TextChannel | null> => {
    let channel = guild.channels.cache.get(channelId) as TextChannel | null;
    if (!channel) {
        channel = await guild.channels.fetch(channelId) as TextChannel | null;
    }
    return channel;
};

export const clearChannelMessages = async (channel: TextChannel): Promise<void> => {
    await channel.bulkDelete(100);
};
