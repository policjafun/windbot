const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, Client } = require('discord.js');
const fs = require("fs");
const AppBan = require("../../models/ApplicationBan");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Wyświetla informacje na temat wybranej osoby.")
        .addUserOption(option =>
            option
                .setName("osoba")
                .setDescription("Osoba do sprawdzenia.")
                .setRequired(true)),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser('osoba');
        const badges = user.flags.toArray().map(flag => flag.toLowerCase());

        const appBan = await AppBan.findOne({ UserId: user.id });
        const date1 = new Date(user.createdAt);
        const createdTimestampInSeconds = Math.floor(user.createdTimestamp / 1000);
        const createdTimestampFormatted = `<t:${createdTimestampInSeconds}:R>`;
        const createdAtFormatted = `<t:${Math.floor(date1.getTime() / 1000)}:R>`;

        const InfoEmbed = new EmbedBuilder()
            .setTitle("Informacje o użytkowniku")
            .addFields(
                { name: "Nazwa użytkownika", value: `${user.username} (${user.id})`, inline: true },
                { name: "Rangi", value: "Rangi", inline: true },
                { name: "Stworzono/Dołączono", value: `${createdAtFormatted} (${createdTimestampFormatted})`, inline: true },
                { name: "AppBan", value: appBan ? "Zbanowany" : "Nie zbanowany", inline: true },
                { name: "Informacje o koncie Discord", value: badges.join(", ") || "Brak odznak", inline: true })
            .setColor("#21B2AD")
            .setFooter({ text: "Beta by @doniczka", iconURL: user.avatarURL() });

        interaction.reply({ embeds: [InfoEmbed] })
    }
};
