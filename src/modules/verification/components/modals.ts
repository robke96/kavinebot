import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, type ModalActionRowComponentBuilder } from "discord.js";

export const createVerificationModal = (mathQuestion: string, mathAnswer: number) => {
    const modal = new ModalBuilder()
        .setCustomId(`mathInput/${mathAnswer}`)
        .setTitle("REGISTRACIJA");

    const questionInput = new TextInputBuilder()
        .setCustomId(`mathInput/${mathAnswer}`)
        .setLabel(`Išpreskite uždavinį: ${mathQuestion}`)
        .setPlaceholder('Įrašykite atsakymą')
        .setStyle(TextInputStyle.Short)
        .setMaxLength(2)
        .setMinLength(1)
        .setRequired(true);

    const row = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(questionInput);
    modal.addComponents(row);

    return modal;
};