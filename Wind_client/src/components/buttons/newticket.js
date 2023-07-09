const { ButtonInteraction, Client, ActionRowBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits, ButtonStyle, ButtonBuilder } = require('discord.js');
const LogiSchema = require('../../models/Logi');

module.exports = {
    data: {
        name: "newticket"
    },

    /**
     * 
     * @param {ButtonInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { member, guild } = interaction;

        const logi = await LogiSchema.findOne({ guildId: guild.id });
        if (logi) {
            console.log('channelId:', logi.channelId);
            console.log('events:', logi.events);
        }

        const embed = new EmbedBuilder()
            .setTitle("Opcje Ticketa")
            .addFields(
                { value: `${member.user.id}`, name: `ID`, inline: true },
                { value: `<t:${parseInt(interaction.createdTimestamp / 1000, 10)}>`, name: `date`, inline: true }
            )
            .setColor(0x21B2AD)
            .setFooter({ text: `Beta by @doniczka` });

        const confirm = new ButtonBuilder()
            .setCustomId('delticket')
            .setLabel('Usun ticket')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents(confirm);

        // Pobierz istniejące kanały ticketa z serwera
        const ticketChannels = guild.channels.cache.filter(channel =>
            channel.type === ChannelType.GuildText && channel.name.startsWith('ticket_')
        );

        // Ustal numer kolejnego ticketa
        let ticketNumber = ticketChannels.size + 1;

        const channelName = `ticket_${ticketNumber}`;

        interaction.guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: member.user.id,
                    allow: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: interaction.guild.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
            ],
        }).then(channel => {
            channel.send({ embeds: [embed], components: [row] });
        });
    }
};
