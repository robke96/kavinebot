import { Events, GuildMember } from "discord.js";
import DiscordClient from "../../core/client";
import { botConfig } from "../../config/botConfig";
import { addUserToDatabase, createVerificationChannel, createVerificationCard, createVerificationButtons } from "../../services/verificationService";
import type { Event } from "../../core/handlers/eventHandler";

const event: Event = {
    name: Events.GuildMemberAdd,
    isEnabled: botConfig.verificationSystem,
    async execute(client: DiscordClient, member: GuildMember) {
        // create new channel for user
        const newChannel = await createVerificationChannel(member.guild, member);

        // add to database
        await addUserToDatabase(member);
    
        // create cards, buttons
        const card = await createVerificationCard(member);
        const buttons = createVerificationButtons();
        // send message
        newChannel.send({ files: [card], components: [buttons] })
    }
}

export default event;