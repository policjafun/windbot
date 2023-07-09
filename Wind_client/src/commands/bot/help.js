const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, Client } = require('discord.js');
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pomoc")
    .setDescription("wyświetla wszystkie komendy bota"),

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const dirs = fs.readdirSync("./src/commands");
    const slashCommands = await client.application.commands.fetch();

    const Buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("help_feedback")
        .setLabel("Rekrutacja")
        .setStyle(ButtonStyle.Success)
        .setDisabled(false),
      new ButtonBuilder()
        .setLabel("Strona")
        .setStyle(ButtonStyle.Link)
        .setURL("https://avocadus.tech")
    );

    const embedMsg = new EmbedBuilder()
      .setTitle("Lista komend")
      .setDescription("Wybierz kategorię poniżej, aby otrzymać listę")
      .addFields(
        {
          name: `Liczba kategorii`,
          value: `${dirs.length}`,
          inline: true,
        },
        {
          name: `Wszystkie funkcje`,
          value: `${slashCommands.size}`,
          inline: true,
        }
      )
      .setColor("DarkGreen");

    let helpMenu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("helpMenu")
        .setMaxValues(1)
        .setMinValues(1)
        .setPlaceholder("Wybierz kategorię")
    );

    fs.readdirSync("./src/commands").forEach((command) => {
      helpMenu.components[0].addOptions({
        label: `${command}`,
        description: `Kategoria`,
        value: `${command}`,
      });
    });

    // Check if the interaction has already been replied to
    if (!interaction.replied) {
      interaction.channel.send({ embeds: [embedMsg], components: [helpMenu, Buttons] });
    }
  }
};
