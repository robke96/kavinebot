import { type SlashCommandT } from './../../core/client';
import { SlashCommandBuilder, type Interaction } from "discord.js";

const command: SlashCommandT = {
    command: new SlashCommandBuilder()
    .setName("pingas")
    .setDescription('test command'),
    execute(interaction) {
        interaction.reply({ content: "Slash command veikia", ephemeral: true });
    }
}

export default command;