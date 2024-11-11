import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"

// Profilis buttons
export const profilisChannelButtons = () => {
    const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
        .setCustomId("editProfile")
        .setLabel("REDAGUOK PROFILI")
        .setEmoji("1128405939523952681")
        .setStyle(ButtonStyle.Primary)
    )

    return buttonRow;
}

// Naujokams - informacija kanalas buttons