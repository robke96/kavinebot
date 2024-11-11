import { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputComponent, TextInputStyle, UserFlagsBitField, type Interaction, type ModalActionRowComponentBuilder } from "discord.js";
import { botConfig } from "../../../config/botConfig";
import type DiscordClient from "../../../core/client";
import { UserModel } from "../../../database/models/userModel";
import logger from "../../../shared/utils/logger";
import { generateMathQuestion } from "../services/verifyService";
import { createVerificationModal } from "../components/modals";
import type { EventI } from "../../../shared/types/event";

const event: EventI = {
    name: Events.InteractionCreate,
    isEnabled: botConfig.verificationSystem,
    async execute(client: DiscordClient, interaction: Interaction) {
        // handle buttons
        if (interaction.isButton()) {
            if (interaction.customId === "registracijaButton") {
                const { mathQuestion, mathAnswer } = generateMathQuestion();

                const modal = createVerificationModal(mathQuestion, mathAnswer);
                await interaction.showModal(modal);
            }
        }
    // handle modal
        if (interaction.isModalSubmit()) {
            const { value, customId } = interaction.fields.fields.first() as TextInputComponent;
            const [_, answer] = customId.split('/');  

            if (value === answer) {
                if (interaction.guild) {
                    let narysRole = interaction.guild.roles.cache.get(botConfig.narysRoleId);
                    let interactionUser = interaction.guild.members.cache.get(interaction.user.id)

                    if (!narysRole) interaction.guild.roles.fetch(botConfig.narysRoleId);
                    if (!interactionUser) interaction.guild.members.fetch(interaction.user.id);

                    if (narysRole && interactionUser) {
                        interactionUser.roles.add(narysRole);
                    }

                    await UserModel.updateOne({
                        userId: interaction.user.id
                    }, {
                        verifiedAt: Date.now(),
                        lastActivityAt: Date.now(),
                    })

                    interaction.reply({ content: '__', ephemeral: true }).then(() => {
                        interaction.message?.channel.delete();
                    })
                }
            } else {
                interaction.reply({ content: `Atsakymas neteisingas, bandykite dar kartą.`, ephemeral: true });
            }
        }
    }
}

export default event;