const { Client, SlashCommandBuilder, ChannelType, ChatInputCommandInteraction, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, SelectMenuBuilder, SelectMenuOptionBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setticket")
        .setDescription("ustawticket")
        .addChannelOption(option =>
            option.setName("kanał")
                .setDescription("Kanał, na którym będzie wysłany ticket.")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("description")
                .setDescription("Description")
                .setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options } = interaction;
        const channel = options.getChannel("kanał");
        const welcomeMessage = options.getString("description");

        const ticketEmbed = new EmbedBuilder()
            .setTitle("Utwórz ticket")
            .setDescription(welcomeMessage)
            .setColor(0x21B2AD)
            .setFooter({ text: `Beta by @doniczka` }); // Use the decimal representation of the color code

        const confirm = new ButtonBuilder()
            .setCustomId('newticket')
            .setLabel('Stwórz Ticket')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents(confirm);

        channel.send({ embeds: [ticketEmbed], components: [row] });
        interaction.reply({ embeds: [ticketEmbed], components: [row] });
    }
};
