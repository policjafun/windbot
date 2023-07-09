const { EmbedBuilder } = require('@discordjs/builders');
const { Client, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addemoji')
        .setDescription('dodaj emoji')
        .addAttachmentOption(
            option =>
                option.setName("plik")
                    .setDescription("podaj plik")
                    .setRequired(true))
        .addStringOption(
            option =>
                option.setName("nazwa")
                    .setDescription("nazwa ikonki")
                    .setRequired(true))

        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageEmojisAndStickers),
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { options } = interaction;

        const nazwa = options.getString('nazwa');
        const plik = options.getAttachment('plik')
        const plikURL = plik.url;
        const guildemoji = interaction.guild;
        console.log('nazwa')
        try {
            const Response = new EmbedBuilder()
                .setTitle(`<:new:1126148090433388665> ${nazwa} - ${interaction.user.username}`)
                .setColor(0x21B2AD)
                .setImage(plikURL)
                .setTimestamp(new Date())
                .setFooter({ text: `Beta by @doniczka` });



            interaction.guild.emojis.create({ attachment: plikURL, name: nazwa })
                .then(emoji => interaction.reply({ embeds: [Response] })

                )
                .catch(console.error);
        } catch (e) {
            interaction.reply({ content: "Wystąpil błąd", ephemeral: true })
            console.error(e)
        }
    }
}