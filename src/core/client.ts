import { Client, GatewayIntentBits, Partials, Options, Collection, SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import eventHanlder from "./handlers/eventHandler";
import { registerSlashCommands, slashCommandHandler } from "./handlers/commandHandler";

export type SlashCommandT = {
    command: SlashCommandBuilder
    execute: (interaction: ChatInputCommandInteraction) => Promise<void> | void,
}
    
class DiscordClient extends Client {
    slashCommandsCollection: Collection<string, SlashCommandT>

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildPresences
            ],
            partials: [
                Partials.Message, 
                Partials.Channel, 
                Partials.GuildMember,
                Partials.User
            ],
            makeCache: Options.cacheWithLimits({
                ...Options.DefaultMakeCacheSettings,
                ReactionManager: 0,
            }),
        })

        this.slashCommandsCollection = new Collection();

        // event handler
        eventHanlder(this);
        // slash command handler
        registerSlashCommands(this)
    }
}

export default DiscordClient;