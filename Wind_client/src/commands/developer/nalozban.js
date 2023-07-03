const { ButtonInteraction, SlashCommandBuilder, Client, AttachmentBuilder, EmbedBuilder, messageLink,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    ModalSubmitInteraction
} = require('discord.js')
const AppBan = require("../../models/ApplicationBan");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("panel-owner")
        .setDescription("Nalóż bana na osobę essa z nobkiem")
        .addStringOption(option =>
            option
                .setName("akcja")
                .setDescription("Wybierz akcję")
                .setRequired(true)
                .addChoices(
                    { name: "ban", value: "ban" },
                    { name: "unban", value: "unban" }
                ))
    ,

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {

        const action = interaction.options.getString('akcja');

        if (interaction.user.id == "485414045516562443" || interaction.user.id == "489117281289240576") {


            switch (action) {
                case 'ban':
                    const modal = new ModalBuilder()
                        .setCustomId('devpanel')
                        .setTitle('Zablokuj użytkownika');


                    const ban_id = new TextInputBuilder()
                        .setCustomId('iduzytkownika')
                        // The label is the prompt the user sees for this input
                        .setLabel("Podaj Id użytkownika do zablokowania")
                        // Short means only a single line of text
                        .setStyle(TextInputStyle.Short);

                    const ban_powod = new TextInputBuilder()
                        .setCustomId('powod')
                        .setLabel("Podaj powod zablokowania")
                        .setStyle(TextInputStyle.Paragraph);


                    const firstActionRow = new ActionRowBuilder().addComponents(ban_id);
                    const secondActionRow = new ActionRowBuilder().addComponents(ban_powod);
                    modal.addComponents(firstActionRow, secondActionRow);


                    await interaction.showModal(modal);
                    break;
                case 'unban':
                    const UnbanModal = new ModalBuilder()
                        .setCustomId('devpanel')
                        .setTitle('Odblokuj użytkownika');


                    const unban_id = new TextInputBuilder()
                        .setCustomId('iduzytkownika')
                        // The label is the prompt the user sees for this input
                        .setLabel("Podaj Id użytkownika do odblokowania")
                        // Short means only a single line of text
                        .setStyle(TextInputStyle.Short);

                    const uban_powod = new TextInputBuilder()
                        .setCustomId('powod')
                        .setLabel("Podaj powod odblokowania")
                        .setStyle(TextInputStyle.Paragraph);


                    const ubnan_first = new ActionRowBuilder().addComponents(unban_id);
                    const unban_second = new ActionRowBuilder().addComponents(uban_powod);
                    UnbanModal.addComponents(ubnan_first, unban_second);


                    await interaction.showModal(UnbanModal);
                    break;

                    break;
                case 'grant-permission':

                    const permissionModal = new ModalBuilder()
                        .setCustomId('devpanel')
                        .setTitle('Odblokuj użytkownika');


                    const permisje_id = new TextInputBuilder()
                        .setCustomId('iduzytkownika')
                        // The label is the prompt the user sees for this input
                        .setLabel("Podaj Id użytkownika do nadania permisji")
                        // Short means only a single line of text
                        .setStyle(TextInputStyle.Short);

                    const permisje_powod = new TextInputBuilder()
                        .setCustomId('powod')
                        .setLabel("Podaj powod do nadania permisji")
                        .setStyle(TextInputStyle.Paragraph);


                    const pemisje_1 = new ActionRowBuilder().addComponents(permisje_id);
                    const permisje_2 = new ActionRowBuilder().addComponents(permisje_powod);
                    UnbanModal.addComponents(pemisje_1, permisje_2);


                    await interaction.showModal(permissionModal);

                    break;
                case 'revoke-permission':
                    const unpermissionModal = new ModalBuilder()
                        .setCustomId('devpanel')
                        .setTitle('Odblokuj użytkownika');


                    const unpermisje_id = new TextInputBuilder()
                        .setCustomId('iduzytkownika')
                        // The label is the prompt the user sees for this input
                        .setLabel("Podaj Id użytkownika do zabrania permisji")
                        // Short means only a single line of text
                        .setStyle(TextInputStyle.Short);

                    const unpermisje_powod = new TextInputBuilder()
                        .setCustomId('powod')
                        .setLabel("Podaj powod do zabrania permisji")
                        .setStyle(TextInputStyle.Paragraph);


                    const unpemisje_1 = new ActionRowBuilder().addComponents(unpermisje_id);
                    const unpermisje_2 = new ActionRowBuilder().addComponents(unpermisje_powod);
                    unpermissionModal.addComponents(unemisje_1, unpermisje_2);


                    await interaction.showModal(permissionModal);
                    break;
                default:
                    console.log('xdxd')
                    break;
            }
        } else {
            interaction.channel.send({ content: "Brak permisji ", ephermal: true })
        }
    }
};
