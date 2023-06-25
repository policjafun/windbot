const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, Client, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const fs = require("fs");
const { createCanvas, registerFont } = require('canvas');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("suggestion")
        .setDescription("Wyświetla parametry bota"),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {


        const modal = new ModalBuilder()
        .setCustomId('suggest')
        .setTitle('Sugestie');


    const suggestModal = new TextInputBuilder()
        .setCustomId('sugestieId')
        .setLabel("treść sugestii")
        .setStyle(TextInputStyle.Paragraph);

    const suggestModal1 = new ActionRowBuilder().addComponents(suggestModal);
    // Add inputs to the modal
    modal.addComponents(suggestModal1);

    

    interaction.showModal(modal)

        console.log(modal)

    }
};
