import path from "node:path";
import fs, { readdirSync } from "node:fs";
import { Events, REST, Routes, SlashCommandBuilder, type Interaction } from "discord.js";
import type DiscordClient from "../client";
import logger from "../../shared/utils/logger";
import type { SlashCommandT } from "../client";
import { botConfig } from "../../config/botConfig";

// Registering slash commands
export function registerSlashCommands(client: DiscordClient): void {
    // Turn off if false
    if (!botConfig.slashCommands) return;

    const commands: SlashCommandBuilder[] = [];
    
    // Load commands from 'shared/commands/'
    const sharedCommandsPath = path.join(__dirname, "../../shared/commands");

    fs.readdirSync(sharedCommandsPath).forEach(file => {
        const commandPath = path.join(sharedCommandsPath, file);
        try {
            const cmd: SlashCommandT = require(commandPath).default;
            commands.push(cmd.command);
            client.slashCommandsCollection.set(cmd.command.name, cmd);
        } catch (error) {
            logger.error(`CommandHandler: Nepavyko užkrauti ${file}: ${error}`);
        }
    })

    //  Load commands from each module 'modules/module/index.ts'
    const modulesPath = path.join(__dirname, "../../modules");
    const moduleFolders = fs.readdirSync(modulesPath);

    for (const moduleFolder of moduleFolders) {
        const moduleIndexPath = path.join(modulesPath, moduleFolder, 'index.ts');

        if (!fs.existsSync(moduleIndexPath)) continue;

        try {
            // import commands array from index.ts
            const { commands: moduleCommands }: { commands: SlashCommandT[] } = require(moduleIndexPath);

            for (const cmd of moduleCommands) {
                commands.push(cmd.command);
                client.slashCommandsCollection.set(cmd.command.name, cmd);
            }
        } catch (error) {
            logger.error(`CommandHandler: Nepavyko užkrauti ${moduleFolder}/index.ts: ${error}`);
        }
    }

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