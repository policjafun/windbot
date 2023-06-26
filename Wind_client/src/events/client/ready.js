const { Client, AttachmentBuilder } = require("discord.js");
const { activityInterval, database } = require("../../../config.json");
const mongoose = require('mongoose');
const chalk = require('chalk');
const { createCanvas, loadImage, registerFont } = require('canvas');

module.exports = {
  name: "ready",
  rest: false,
  once: false,
  /**
   * @param {Client} client
   */
  async execute(client) {

    /* Connect to database */
    if (!database) return;
    mongoose.connect(database, {}).then(() => console.log(chalk.green("db connected"))).catch((err) => console.error(err));

    console.log(
      `Zalogowano jako ${client.user.tag} jestem na ${client.guilds.cache.size} serwerach`
    );
    updateActivity(client);

    const guildsCount = client.guilds.cache.size;
    let membersCount = 0;
    client.guilds.cache.forEach((guild) => {
      membersCount += guild.memberCount;
    });

    // Ścieżka do pliku czcionki
   // Ścieżka do pliku tła
   
    // Rozmiary canvasu
    const canvasWidth = 400;
    const canvasHeight = 200;

    // Funkcja główna do tworzenia canvasu
    async function createImage() {
      // Rejestracja czcionki
     
      // Tworzenie nowego canvasu
      const canvas = createCanvas(canvasWidth, canvasHeight);
      const context = canvas.getContext('2d');
    
      // Tworzenie gradientu czarno-białego
      const gradient = context.createLinearGradient(0, 0, 0, canvasHeight);
      gradient.addColorStop(0, '#000000'); // Czarny kolor na górze
      gradient.addColorStop(1, '#ffffff'); // Biały kolor na dole
    
      // Wypełnienie tła gradientem
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvasWidth, canvasHeight);
    
      // Ustawianie parametrów tekstu
      const fontSize = 24;
      const textColor = '#000000'; // Czarny kolor tekstu
      const textX = 20;
      const textY = 50;
    
      // Aktualny czas
      const currentTime = new Date();
      const formattedTime = currentTime.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    
      // Wczytywanie obrazka
      const image = await loadImage(__dirname, "../../../images/image.png");
    
      // Rysowanie obrazka
      context.drawImage(image, 20, 80, 100, 100);
    
      // Rysowanie tekstu
      context.font = `${fontSize}px Arial`;
      context.fillStyle = textColor;
      context.fillText(`Liczba użytkowników: ${membersCount}`, textX, textY);
      context.fillText(`Liczba serwerów: ${guildsCount}`, textX, textY + fontSize + 10);
      context.fillText(formattedTime, canvasWidth - 100, canvasHeight - 20);
    
      // Zapisywanie obrazka
      const imageBuffer = canvas.toBuffer('image/png');
      // Zapisanie obrazka do pliku
      // require('fs').writeFileSync('ścieżka_do_zapisu_obrazka.png', imageBuffer);
    
      return imageBuffer;
    }
    
    
    const statchannelid = '1122823282132013087';
    let messageInterval;

    async function sendNewMessage() {
      const channel = client.channels.cache.get(statchannelid);
      if (!channel) {
        console.log('Nie można znaleźć kanału o podanym ID.');
        return;
      }

      try {
        const messages = await channel.messages.fetch({ limit: 1 });
        const oldMessage = messages.first();

        if (oldMessage) {
          await oldMessage.delete();
        }

        createImage()
          .then((imageBuffer) => {
            const attachment = new AttachmentBuilder(imageBuffer, { name: 'stats.png' });
            channel.send({ files: [attachment] });
          })
          .catch((error) => {
            console.error('Wystąpił błąd podczas tworzenia obrazka:', error);
          });

        console.log('Wysłano nową wiadomość.');
      } catch (error) {
        console.error('Wystąpił błąd podczas wysyłania wiadomości:', error);
      }
    }

    // Ustawienie interwału dla wysyłania wiadomości
    messageInterval = setInterval(sendNewMessage, 10000);

    // Nasłuchiwanie na zdarzenie zakończenia działania programu
    process.on('SIGINT', () => {
      clearInterval(messageInterval); // Zatrzymanie interwału
      console.log('Program został zatrzymany.');
      process.exit();
    });
  },
};

/**
 * @param {Client} client
 */
async function updateActivity(client) {
  let servercount = await client.guilds.cache.size;

  const activities = [
    `@doniczka`,
  ];

  setInterval(() => {
    const status = activities[Math.floor(Math.random() * activities.length)];
    client.user.setActivity(status);
  }, activityInterval * 1000);
}
