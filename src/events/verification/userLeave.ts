import { ChannelType, Events, GuildMember } from "discord.js";
import type { Event } from "../../core/handlers/eventHandler";
import { botConfig } from "../../config/botConfig";
import type DiscordClient from "../../core/client";
import { UserModel } from "../../database/models/userModel";

const event: Event = {
    name: Events.GuildMemberRemove,
    isEnabled: botConfig.verificationSystem,
    async execute(client: DiscordClient, member: GuildMember) {
        const User = await UserModel.findOne({
            userId: member.user.id
        })

        if (User) {
            if (!User.verifiedAt) {
                console.log(User)
                const guild = await client.guilds.fetch(botConfig.guildId);
                const categoryChannel = guild.channels.cache.get(botConfig.registerCategoryId);
    
                if (categoryChannel) {
                    console.log('1')
                    const channelsInCategory = guild.channels.cache.filter(channel => channel.parentId === categoryChannel.id);
    
                    const foundChannels = channelsInCategory.filter(ch => ch.name === `⏳︱${member.user.displayName}`)
                    foundChannels.forEach(channel => {
                        channel.delete();
                    })
                }
            }
        }

        await UserModel.deleteOne({ userId: member.user.id });
    }
}

export default event;