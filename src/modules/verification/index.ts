// Importai
import interactionCreate from "./events/interactionCreate";
import guildMemberAdd from "./events/guildMemberAdd";
import guilderMemberRemove from "./events/guildMemberRemove";

// Export
export const commands = [];

export const events = [
    guildMemberAdd,
    guilderMemberRemove,
    interactionCreate,
];
