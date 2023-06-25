const { ButtonInteraction, Client, ActionRowBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits, ButtonStyle, ButtonBuilder } = require('discord.js')
const WeryfikacjaSchema = require('../../models/weryfikacja');

module.exports = {
    data: {
        name: "weryfikacjabtn"
    },
    /**
     * 
     * @param {ButtonInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { member, guild } = interaction;

        const guildData = await WeryfikacjaSchema.findOne({ guildId: guild.id });
        if (!guildData) return;
        const roleId = guildData.roleId;
        member.roles.add([roleId]).then(() => {
            interaction.reply({ content: `Zostałeś zweryfikowany!`, ephemeral: true });
        }).catch(console.error);
    }  
};
