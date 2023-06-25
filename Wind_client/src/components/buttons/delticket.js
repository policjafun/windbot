const { ButtonInteraction, Client, ActionRowBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits, ButtonStyle, ButtonBuilder } = require('discord.js')

module.exports = {
    data: {
        name: "delticket"
    },
    /**
     * 
     * @param {ButtonInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { member, guild } = interaction;



        const currentTime = Math.floor(Date.now() / 1000);
        const timestamp = currentTime + 10;



        interaction.reply({
            content: `Ticket zostanie zamknięty <t:${timestamp}:R>`,
            ephemeral: true
        })
        setTimeout(() => {
            interaction.channel.delete();
            }, 10000); 

    }  
};
