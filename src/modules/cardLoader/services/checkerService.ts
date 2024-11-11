import type { ActionRowBuilder, AttachmentBuilder, GuildBasedChannel, TextChannel } from "discord.js";

// check if channel has old or none cards.
export const shouldUpdateChannel = async (channel: TextChannel) => {
        const messages = await channel.messages.fetch({ limit: 100 });
        const lastMessage = messages.last();
        
        const now = Date.now();
        const oneWeek = 7 * 24 * 60 * 60 * 1000;

        // if channel has more than 1 message
        if (messages.size > 1 || messages.size == 0) {
            return true;
        };
        
        // if message is older than 1 week from now
        if (lastMessage) {
            if (lastMessage.createdTimestamp <= now - oneWeek) {
                return true;
            }
        } 

        return false;   
}
