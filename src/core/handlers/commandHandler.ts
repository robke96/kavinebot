import path from "node:path";
import fs, { readdirSync } from "node:fs";
import { Events, REST, Routes, SlashCommandBuilder, type Interaction } from "discord.js";
import type DiscordClient from "../client";
import logger from "../../utils/logger";
import type { SlashCommandT } from "../client";
import { botConfig } from "../../config/botConfig";

// Registering slash commands
export function registerSlashCommands(client: DiscordClient): void {
    // Turn off if false
    if (!botConfig.slashCommands) return;

    const commands: SlashCommandBuilder[] = [];
    const commandsPath = path.join(__dirname, "../../commands");

    fs.readdirSync(commandsPath).forEach(file => {
        try {
            let cmd: SlashCommandT = require(`${commandsPath}/${file}`).default;
            commands.push(cmd.command);
            client.slashCommandsCollection.set(cmd.command.name, cmd);
        } catch (err) {
            logger.error(`Failed to load command ${file}: ${err}`);
        }
    });

    const rest = new REST().setToken(botConfig.token);

    rest.put(Routes.applicationGuildCommands(botConfig.botId, botConfig.guildId), {
        body: commands.map(c => c.toJSON())
    }).catch(e => {
        logger.error(e);
    })
    
    slashCommandHandler(client);
    logger.info(`Sėkmingai užregistruota ${commands.length} (/) komandų.`);
}

// Slash command handler
export function slashCommandHandler(client: DiscordClient) {
    client.on(Events.InteractionCreate, (interaction: Interaction) => {
        if(!interaction.isChatInputCommand()) return;

        const command = client.slashCommandsCollection.get(interaction.commandName);

        try {
            if (command) command.execute(interaction);
        } catch (error: any) {
            logger.error("Command handler:");
            interaction.reply({ content: error.message, ephemeral: true });
        }
    })
}