const { Client, CommandInteraction, InteractionType, Collection } = require("discord.js");
const AppBan = require("../../models/ApplicationBan");

module.exports = {
  name: "interactionCreate",
  rest: false,
  once: false,
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async execute(interaction, client) {
    client.selectMenus = new Collection(); // Inicjalizacja kolekcji selectMenus

    const banuserid = await AppBan.findOne({ UserId: interaction.user.id });
    if (banuserid)
      return interaction.reply({
        content: `Rejected (banned) unban? write to doniczka @wind owner, Reason: ${banuserid.reason}`,
        ephemeral: true,
      });
    if (interaction.isChatInputCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (err) {
        console.error(err);
        interaction.reply({
          content: `Coś poszło nie tak używając tej funkcji.`,
          ephemeral: true,
        });
      }
    } else if (interaction.isButton()) {
      const { buttons, selectMenus } = client;
      const button = buttons.get(interaction.customId);

      if (button) {
        try {
          await button.execute(interaction, client);
        } catch (error) {
          console.error(error);
        }
      }
    } else if (
      interaction.type === InteractionType.MessageComponent &&
      interaction.isStringSelectMenu()
    ) {
      const { selectMenus } = client;
      const selectMenu = selectMenus.get(interaction.customId);

      if (selectMenu) {
        try {
          await selectMenu.execute(interaction, client);
        } catch (error) {
          console.error(error);
        }
      }
    } else if (
      interaction.type === InteractionType.MessageComponent &&
      interaction.isModal()
    ) {
      const { modals } = client;
      const modal = modals.get(interaction.customId);

      if (modal) {
        try {
          await modal.execute(interaction, client);
        } catch (error) {
          console.error(error);
        }
      }
    } else if (interaction.isContextMenuCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const contextCommand = commands.get(commandName);
      if (!contextCommand) return;

      try {
        await contextCommand.execute(interaction.client);
      } catch (error) {
        console.error(error);
      }
    }
  },
};
