const { EmbedBuilder } = require('@discordjs/builders');
const { Client, SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } = require('discord.js')
const { loadCommands } = require('../../Handlers/CommandHandler')
const { loadEvents } = require('../../Handlers/EventHandler')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("debug")
        .setDescription("Reload your events/command!")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(
            command =>
                command.setName("eventy")
                    .setDescription("debug eventow"))
                    .addSubcommand(
                        command =>
                            command.setName("funkcje")
                                .setDescription("debug funkcji"))
         .addSubcommand(
            command =>
                command.setName("wszytko")
                    .setDescription("debug wszytkiego")),
    developer: true,
    /**
     * @param { ChatInputCommandInteraction } interaction
     */
    async execute(interaction, client) {

        const sub = interaction.options.getSubcommand();
        const Response = new EmbedBuilder()
            .setTitle("💻 Developer")
            .setColor(client.mainColor)

        switch (sub) {
            case "commands": {
                loadCommands(client);
                interaction.reply({ embeds: [Response.setDescription("✅ Reloaded Commands!")] })
            }
                break;

            case "events": {
                loadEvents(client);
                interaction.reply({ embeds: [Response.setDescription("✅ Reloaded Events!")] })
            }

            case "wszytko" : {
                loadCommands(client);
                loadEvents(client);
                interaction.reply({ embeds: [Response.setDescription("✅ wszytko g")] })
                console.log("@doniczka reload wind wszytkto")

            }
                break;
        }

    },
}