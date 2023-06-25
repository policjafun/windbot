const { ButtonInteraction, Client, AttachmentBuilder, EmbedBuilder, messageLink,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    ModalSubmitInteraction
} = require('discord.js')
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    data: {
        name: "Sugestie"
    },
    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
 
     


        console.log(interaction)



        

    }
}
