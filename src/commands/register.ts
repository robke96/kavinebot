import { SlashCommandBuilder } from "discord.js";
import type { SlashCommandT } from "../core/client";
import { createVerifyCard } from "../services/verificationService";

const command: SlashCommandT = {
    command: new SlashCommandBuilder()
    .setName("register")
    .setDescription('test register card'),
    async execute(interaction) {
        const serverIcon = interaction.guild?.iconURL({ extension: 'png' }) as string;


    }
}

export default command;