const { Client,  StringSelectMenuInteraction, EmbedBuilder, embedLength } = require('discord.js')
const fs = require("fs");
module.exports = {
    data: {
        name: 'verifyinteraction'
    },
    /**
     * @param { StringSelectMenuInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
   
  
          const embed = new EmbedBuilder()
          .setTitle(`asdsad`)
          .setDescription(`asdsadasd`)
          .setColor(0x21B2AD);


          await interaction.reply({ embeds: [embed], ephemeral: true})
    }
}