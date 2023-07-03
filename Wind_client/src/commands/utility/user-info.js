const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, Client } = require('discord.js');
const fs = require("fs");
const AppBan = require("../../models/ApplicationBan");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("wyświetla informacje na temat osoby wybranej")
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

        const InfoEmbed = new EmbedBuilder()
            .setTitle("User info")
            .setFields(
                { name: "username", value: `${user.username} (${user.id})`, inline: true },
                { name: "Rangi:", value: "Rangi", inline: true },
                { name: "Stworzono/Dołaczono", value: `${user.createdAt}, (${user.createdTimestamp})`, inline: true },
                { name: "AppBan", value: appBan ? "Banned" : "Not banned", inline: true },
                { name: "Discord Info", value: badges.join(", "), inline: true }
            )
            .setColor(`#21B2AD`)
            .setFooter({ text: `beta by @doniczka` });

        console.log(interaction.user);
        console.log(appBan);
        interaction.deferReply({ embeds: [InfoEmbed] });
        interaction.deleteReply();
        interaction.channel.send({ embeds: [InfoEmbed] });
    }
};
