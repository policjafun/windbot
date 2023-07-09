const { EmbedBuilder } = require('@discordjs/builders');
const { Client, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require('discord.js')
const datastats = require('../../models/statystykiSchema')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('relaodstats')
        .setDescription('Odswiez statystyki')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client) {
      



        const reloaded = new EmbedBuilder()
        .setTitle('Przeladowano')

      interaction.reply({ embeds: [embed] })
    }
}