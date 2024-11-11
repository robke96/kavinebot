import { ActionRowBuilder, Events, Guild, TextChannel } from "discord.js";
import { botConfig } from "../../../config/botConfig";
import type DiscordClient from "../../../core/client";
import type { EventI } from "../../../shared/types/event";
import { getChannelById, clearChannelMessages } from "../services/channelService";
import { shouldUpdateChannel } from "../services/checkerService";
import { channelsList } from "../config/channelConfig";
import logger from "../../../shared/utils/logger";
import createTemplateCard from "../../../shared/components/cards/staticCardTemplate";

const event: EventI = {
    name: Events.ClientReady,
    once: true,
    isEnabled: botConfig.loadingCardsSystem,
    async execute(client: DiscordClient) {
        const guild = client.guilds.cache.get(botConfig.guildId) as Guild;
        const year = new Date().getFullYear();
        const serverIcon = guild.iconURL({ extension: "png" }) as string;
        const whiteText = `Kavinė ${year}`;

        for (const channel of channelsList) {
            const getChannel = await getChannelById(guild, channel.channelId) as TextChannel;

            if (getChannel && (await shouldUpdateChannel(getChannel))) {
                try {
                    await clearChannelMessages(getChannel);
                    
                    const card = await createTemplateCard(serverIcon, whiteText, channel.cardName);
                    const buttons = channel.buttons

                    await getChannel.send({ files: [card], components: buttons });
                } catch (error) {
                    logger.error(`Klaida bandant atnaujinti kortele į kanala ${getChannel.name}`);
                }
            }
        }
    }
};

export default event;
