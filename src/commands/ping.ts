import { SlashCommandBuilder } from "discord.js";
import type { SlashCommandT } from "../core/client";

const command: SlashCommandT = {
    command: new SlashCommandBuilder()
    .setName("test")
    .setDescription('test command'),
    execute(interaction) {
        interaction.reply({ content: "Slash command veikia", ephemeral: true });
    }
}

export default command;