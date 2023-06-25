const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    Client,
    AttachmentBuilder,
} = require("discord.js");

const { createCanvas, loadImage, registerFont } = require('canvas');





module.exports = {
    data: new SlashCommandBuilder()
        .setName("karta")
        .setDescription("pokazuje karte kogos"),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        registerFont('./fonts/Roboto-Regular.ttf', { family: 'Roboto-Regular' })
        async function generateCreditCard(number, name, expirationDate, cvv) {
            const width = 600;
            const height = 350;
      
            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext('2d');
      
            // Tło karty
            ctx.fillStyle = '#0070f3';
            ctx.fillRect(0, 0, width, height);
      
            // Numer karty
            ctx.font = 'bold 32px Roboto-Regular';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(number, 50, 120);
      
            // Imię i nazwisko posiadacza karty
            ctx.font = '24px Roboto-Regular';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(name, 50, 200);
      
            // Data ważności karty
            ctx.font = 'bold 20px Roboto-Regular';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`Ważna do: ${expirationDate}`, 50, 240);
      
            // CVV
            ctx.font = 'bold 20px Roboto-Regular';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`CVV: ${cvv}`, 50, 280);
      
            const balance = "123123132132131$"
            ctx.font = "bold 24px Roboto-Regular";
            ctx.fillStyle = "#000000";
            ctx.fillText(`Saldo: $${balance}`, 380, 220);
      
            // Eksportuj do Discord.js Attachment
            const buffer = canvas.toBuffer();
      
            return buffer;
          }
      
          const number = '1234 5678 9012 3456';
          const name = `${interaction.user.username}`;
          const expirationDate = '12/24';
          const cvv = '123';
      
          const attachment = new AttachmentBuilder(await generateCreditCard(number, name, expirationDate, cvv), { name: 'karta.png'});
          const embed = new EmbedBuilder()
          .setTitle(`Karta kredytowa: `)
          .setColor("#2b2d31")
          .setImage('attachment://karta.png')
          .setFooter({
            text: `Beta by @doniczka`
          });
          await interaction.reply({ embeds: [embed], files: [attachment] });
        },
}
