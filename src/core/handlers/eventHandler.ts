import path from "node:path";
import fs from "node:fs";
import type DiscordClient from "../client";
import logger from "../../utils/logger";
import type { Events } from "discord.js";

export interface Event {
    name: string | Events;
    once?: boolean;
    isEnabled: boolean;
    execute: (...args: any[]) => void;
}

const eventHandler = async (client: DiscordClient) => {
    const eventsPath = path.join(__dirname, '../../events');
    const eventFolders = fs.readdirSync(eventsPath);

    for (const folder of eventFolders) {
        const folderPath = path.join(eventsPath, folder);
        const eventFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

        for (const file of eventFiles) {
            const eventPath = path.join(folderPath, file);
            try {                
                const event:Event = require(eventPath).default;

                if (event.isEnabled !== undefined && !event.isEnabled) {
                    continue;
                }
                
                if (!event.name || !event.execute) {
                    continue;
                }
                
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(client, ...args));
                } else {
                    client.on(event.name, (...args) => event.execute(client, ...args));
                }
            } catch (_) {
                logger.error(`Failed to load event ${file} in folder ${folder}`);
            }
        }
    }
}

export default eventHandler