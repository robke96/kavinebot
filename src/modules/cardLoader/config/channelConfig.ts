import type { ActionRowBuilder, ButtonBuilder } from 'discord.js';
import { botConfig } from '../../../config/botConfig';
import { profilisChannelButtons } from '../components/buttons';

export type ChannelsListT = {
    cardName: string;
    channelId: string;
    buttons: ActionRowBuilder<ButtonBuilder>[];
}[]

export const channelsList: ChannelsListT = [
    { cardName: "Profilis", channelId: botConfig.profilisChannelId, buttons: [profilisChannelButtons()] },
    { cardName: "Informacija", channelId: botConfig.naujokamsChannelId, buttons: [] },
];
