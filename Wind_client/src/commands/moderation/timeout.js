const { EmbedBuilder } = require('@discordjs/builders');
const { Client, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('wycisz daną osobę na pewien czas')
    .addUserOption(
        option => 
        option.setName("osoba")
        .setDescription("Osoba do timeout.")
        .setRequired(true))
    .addNumberOption(
        option =>
        option.setName("czas")
        .setDescription("czas trawnia timeout`a.")
        .setRequired(true)
        .addChoices(
            { name: "60 sekund", value: 60*1000 },
            { name: "5 minut", value: 5*60*1000 },
            { name: "10 minut", value: 10*60*1000 },
            { name: "30 minut", value: 30*60*1000 },
            { name: "1 godzina", value: 60*60*1000 },
            { name: "1 dzień", value: 24*60*60*1000 },
            { name: "1 tydzień", value: 7*24*60*60*1000 }
        ))
    .addStringOption(
        option =>
        option.setName("powód")
        .setDescription("Podaj powód.")
        .setRequired(true))

    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client
     */
    async execute(interaction, client) {
        const { options } = interaction
        
        let member = options.getMember("user")
        let duration = options.getNumber("czas")
        let reason = options.getString("powód") || "Brak powodu"

        const Response = new EmbedBuilder()
        .setColor(client.mainColor)

        if (!member) return interaction.reply({embeds: [Response.setDescription("❌ Invalid Member given").setColor(client.errorColor)], ephemeral: true})
        
        try {
            await member.timeout(duration, reason)
            Response.setDescription(`🚫 <@${member.user.id}> has been timed out!`)
            .addFields([
                {name: "Powód:", value: reason, inline: false},
            ])

            client.modlogs({
                Member: member,
                Action: "Timeout",
                Color: 0xfff763,
                Reason: reason
            }, interaction)
            return interaction.reply({embeds: [Response]})
        } catch (err) {
            return console.error(err)
        }
    
    }
} 