import createTemplateCard from '../components/cards/staticCardTemplate';
import { type SlashCommandT } from './../../core/client';
import { SlashCommandBuilder } from "discord.js";

const command: SlashCommandT = {
    command: new SlashCommandBuilder()
    .setName("register")
    .setDescription('test register card'),
    async execute(interaction) {
        const serverIcon = interaction.guild?.iconURL({ extension: 'png' }) as string;
        const card = await createTemplateCard(serverIcon, "Labas NICKNAME", "Registracija");

        interaction.reply({ files: [card], ephemeral: true })
    }
}

export default command;