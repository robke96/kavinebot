import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, Guild, ModalBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle, type AnyComponentBuilder, type GuildMember, type ModalActionRowComponent, type ModalActionRowComponentBuilder } from "discord.js";
import createTemplateCard from "../../../shared/components/cards/staticCardTemplate";
import { UserModel } from "../../../database/models/userModel";
import { botConfig } from "../../../config/botConfig";

export const createVerificationCard = async (member: GuildMember) => {
    let memberIcon = member.user.displayAvatarURL({ forceStatic: true, extension: 'png' }) as string;

    if (!memberIcon) {
        memberIcon = member.guild.iconURL({ forceStatic: true, extension: 'png' }) as string;
    }

    const whiteText = "Labas " + member.user.displayName;
    const blueText = "Registracija";

    const card = await createTemplateCard(memberIcon, whiteText, blueText);
    return card;
}

export const addUserToDatabase = async (member: GuildMember) => {
    let user = await UserModel.findOne({ userId: member.id });
    
    if (!user) {
        await UserModel.create({
            userId: member.id,
            userName: member.user.username,
            userAvatar: member.user.avatar,
            lastActivityAt: Date.now(),
        });
    }
};

export const createVerificationChannel = async (guild: Guild, member: GuildMember) => {
    return await guild.channels.create({
        name: `⏳︱${member.user.displayName}`,
        type: ChannelType.GuildText,
        parent: botConfig.registerCategoryId,
        permissionOverwrites: [
            {
                id: guild.roles.everyone, // @everyone
                deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
            },
            {
                id: member.id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory],
                deny: [PermissionFlagsBits.SendMessages],
            },
        ],
    });
};

export const generateMathQuestion = () => {
    const generateNumber = (maxNum: number) => Math.floor(Math.random() * maxNum + 1);
    const num1 = generateNumber(20);
    const num2 = generateNumber(12);
    const mathQuestion = `${num1} + ${num2}`;
    const mathAnswer = num1 + num2;

    return { mathQuestion, mathAnswer }; 
};

