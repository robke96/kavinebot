import { events } from './../../modules/verification/index';
import path from "node:path";
import fs from "node:fs";
import type DiscordClient from "../client";
import logger from "../../shared/utils/logger";
import { type EventI } from "../../shared/types/event";

const eventHandler = async (client: DiscordClient) => {
    // load from shared/events
    const sharedEventsPath = path.join(__dirname, '../../shared/events');
    const sharedEventFolders = fs.readdirSync(sharedEventsPath);

    for (const folder of sharedEventFolders) {
        const folderPath = path.join(sharedEventsPath, folder);
        const eventFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

        for (const file of eventFiles) {
            const eventPath = path.join(folderPath, file);
            try {
                const event: EventI = require(eventPath).default;

                if (event.isEnabled !== undefined && !event.isEnabled) continue;
                if (!event.name || !event.execute) continue;

                if (event.once) {
                    client.once(event.name, (...args) => event.execute(client, ...args));
                } else {
                    client.on(event.name, (...args) => event.execute(client, ...args));
                }
            } catch (err) {
                logger.error(`Nepavyko užkrauti ${folder}/${file}`)
            }
        }
    }

    // load events from modules
    const modulesPath = path.join(__dirname, '../../modules');
    const moduleFolders = fs.readdirSync(modulesPath);

    for (const moduleFolder of moduleFolders) {
        const moduleIndexPath = path.join(modulesPath, moduleFolder, 'index.ts');

        if (!fs.existsSync(moduleIndexPath)) continue;

        try {
            // import events array from index.ts in each module;
            const { events }: { events: EventI[] } = require(moduleIndexPath);

            // register each event in the events array
            for (const event of events) {
                if (event.isEnabled !== undefined && !event.isEnabled) continue;
                if (!event.name || !event.execute) continue;

                if (event.once) {
                    client.once(event.name, (...args) => event.execute(client, ...args));
                } else {
                    client.on(event.name, (...args) => event.execute(client, ...args));
                }
            }
        } catch (error) {
            logger.error(`Nepavyko užkrauti ${moduleFolder}/index.ts ${error} `)
        }
    }

}

export default eventHandler