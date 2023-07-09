const { Client, SlashCommandBuilder, ChannelType, ChatInputCommandInteraction, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, SelectMenuBuilder, SelectMenuOptionBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setverify")
        .setDescription("ustawticket")
        .addChannelOption(option =>
            option.setName("kanal")
                .setDescription("Kana�, na kt�rym b�dzie wys�any ticket.")
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
        const channel = options.getChannel("kanal");

        const ticketEmbed = new EmbedBuilder()
            .setTitle("Weryfikacja")
            .setDescription("aby się zwerfikować wybierz pole Zwerfikuj się. poniżej.")
            .setColor(0x21B2AD)
            .setFooter({ text: `Beta by @doniczka` }); // Use the decimal representation of the color code

        const select = new StringSelectMenuBuilder()
            .setCustomId('verifyinteraction')
            .setPlaceholder('Zweryfikuj się')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(' ')
                    .setValue('bulbasaur'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Zwerfikuj się')
                    .setEmoji('<:verify:1126148092891242597>')
                    .setValue('verifyinteraction'),
                new StringSelectMenuOptionBuilder()
                    .setLabel(' ')
                    .setValue('nic'),
            );

        const row = new ActionRowBuilder()
            .addComponents(select);

        interaction.reply({ embeds: [ticketEmbed], components: [row] });
    }
};
