import { botConfig } from "./config/botConfig";
import logger from "./shared/utils/logger";
import DiscordClient from "./core/client";
import { connectMongoDB } from "./database/mongoConnection";

const client = new DiscordClient();

client.once("ready", () => {
    logger.info("Kavinė Bot sėkmingai prisijungė!")
});

// mongodb connect
(async () => {
    await connectMongoDB(process.env.MONGO_URI as string);
})();

client.login(botConfig.token);