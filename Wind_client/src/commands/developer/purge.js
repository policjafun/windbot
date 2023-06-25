const { SlashCommandBuilder, ChatInputCommandInteraction, Client } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Usuwanie wiadomości')
        .addNumberOption(option =>
            option.setName('ilosc')
                .setDescription('Ilość wiadomości do usunięcia')
                .setRequired(true)),
    async execute(interaction, client) {
        const channel = interaction.channel;
        const amount = interaction.options.getNumber('ilosc');

        if (amount <= 0) {
            return interaction.reply('Podaj liczbę większą od zera.');
        }

        try {
            let deleted = 0;
            let iterations = Math.ceil(amount / 100);

            for (let i = 0; i < iterations; i++) {
                const messages = await channel.messages.fetch({ limit: 100 });
                const messagesToDelete = Array.from(messages.values()).slice(0, amount - deleted);
                const deletedMessages = await channel.bulkDelete(messagesToDelete, true);
                deleted += deletedMessages.size;
            }

            return interaction.reply(`Usunięto ${deleted} wiadomości.`);
        } catch (error) {
            console.error('Wystąpił błąd podczas usuwania wiadomości:', error);
            return interaction.reply('Wystąpił błąd podczas usuwania wiadomości.');
        }
    },
};
