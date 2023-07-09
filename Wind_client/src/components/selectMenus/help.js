const { Client,  StringSelectMenuInteraction, EmbedBuilder, embedLength } = require('discord.js')
const fs = require("fs");
module.exports = {
    data: {
        name: 'helpMenu'
    },
    /**
     * @param { StringSelectMenuInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const selection = interaction.values[0];
        const commands = fs
          .readdirSync(`./src/commands/${selection}`)
          .filter((file) => file.endsWith(".js"))
          .join(" ")
          .split(".js");
         
         
          function capitalizeFL(str) {
            const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
            return capitalized;
          }
  
          const embed = new EmbedBuilder()
          .setTitle(`Lista dla ${selection}`)
          .setDescription(`\`\`\` /${commands}\`\`\``)
          .setColor("DarkGreen")
          .addFields({
            name: `Ilość funkcji w tej kategorii`,  
            value: `${commands.length -  1} funkcja (i)`,
          });


          await interaction.reply({ embeds: [embed], ephemeral: true})
    }
}