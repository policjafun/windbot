const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, Client, } = require('discord.js');
const fs = require("fs");
const { createCanvas, registerFont } = require('canvas');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bot-info")
        .setDescription("Wyświetla parametry bota"),

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        const canvas = createCanvas(500, 300); // Tworzenie canvasa o wymiarach 500x300 (możesz dostosować wymiary według własnych preferencji)
        const ctx = canvas.getContext('2d');

        // Ustawienie koloru tła
        ctx.fillStyle = '#21B2AD'; // Kolor tła (hex: #21B2AD)
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Wczytanie czcionki (jeśli wymaga się użycia czcionki niestandardowej)
       
        // Pobranie informacji o bocie
        const channelCount = client.channels.cache.size;
        const uptime = Math.floor(client.uptime / (1000 * 60 * 60)); 
        const userCount = client.users.cache.size;
        const guildCount = client.guilds.cache.size;
        const ping = client.ws.ping;
        
        ctx.fillStyle = '#000000'; 
        ctx.font = '20px Corbel'; 

        
        ctx.fillText(`Ping: ${ping}ms`, 10, 30);
        ctx.fillText(`Czas działania: ${uptime} godz.`, 10, 60);
        ctx.fillText(`Ilość użytkowników: ${userCount}`, 10, 90);
        ctx.fillText(`Ilość serwerów: ${guildCount}`, 10, 120);
        ctx.fillText(`Ilość serwerów: ${guildCount}`, 10, 150);

       
        const buffer = canvas.toBuffer();
        fs.writeFileSync('bot_info.png', buffer);


      
        const infoEmbed = new EmbedBuilder()
            .setTitle("BotInfo")
            .setImage("attachment://bot_info.png")
            .setColor(0x21B2AD)
            .setFooter({ text: `Beta by: @doniczka` });

        interaction.reply({ embeds: [infoEmbed], files: [{ attachment: 'bot_info.png', name: 'bot_info.png' }] });
    }
};
