const { Client, EmbedBuilder } = require('discord.js');
const AppBan = require("../../models/ApplicationBan");

module.exports = {
    data: {
        name: "devpanel"
    },
    /**
     *
     * @param {ModalSubmitInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const reason = interaction.fields.getTextInputValue('powod');
        const uid = interaction.fields.getTextInputValue('iduzytkownika');

        // Przetwarzanie wartości pól tekstowych
        // Tutaj możesz wykonać odpowiednie działania związane z odczytanymi danymi
        console.log({ reason, uid });

        try {
            const existingBan = await AppBan.findOne({ UserId: uid });
            if (existingBan) {
                const embed = new EmbedBuilder()
                    .setTitle("Błąd")
                    .setDescription(`W bazie danych to ID już jest zapisane jako posiadające bana`)
                    .addFields({ name: `Proba: ${uid}`, value: `Co otrzymałem: Błąd`, inline: false })
                    .setColor("#21B2AD")
                    .setFooter({ text: `@doniczka` });
                interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
                const data = {
                    UserId: uid,
                    reason: reason,
                    ifa: true
                };
                await AppBan.create(data);
                interaction.reply({ embeds: [new EmbedBuilder().setTitle("OK").setDescription("Zapisano w bazie danych").setColor("#21B2AD")], ephemeral: true });
            }
        } catch (error) {
            console.error(error);
            interaction.reply({ content: "Wystąpił błąd podczas zapisu do bazy danych.", ephemeral: true });
        }
    }
};
