const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Client,
  AttachmentBuilder,
} = require("discord.js");
const translate = require('translate-google');

const path = require('path');


module.exports = {
  data: new SlashCommandBuilder()
    .setName("pogoda")
    .setDescription("Is my coding good?")
    .addStringOption((options) =>
      options
        .setName("miasto")
        .setDescription("Check your own code.")
        .setRequired(true)
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {

    const city = interaction.options.getString("miasto");
    const { createCanvas, loadImage, registerFont } = require('canvas');
    const fetch = require('node-fetch');


    // Funkcja do pobierania ikony pogody z serwisu OpenWeatherMap

    async function getWeatherIcon(iconCode) {
      const response = await fetch(`http://openweathermap.org/img/wn/${iconCode}.png`);
      const buffer = await response.buffer();
      return buffer;
    }

    // Funkcja do pobierania aktualnych informacji o pogodzie z OpenWeatherMap
    async function getCurrentWeather(city) {
      const apiKey = '4841e5aca59ce146ef27758023789e85';
      const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
      const data = await response.json();

      const errorEmbed = new EmbedBuilder()
        .setTitle(`Błąd`)
        .setDescription(`Nie jestem w stanie wyszukać informacjii o pogodzie w ${city}`)
        .setFooter({
          text: `Beta by @doniczka`
        });
      if (data.cod !== 200) return console.log(`data.cod !== 200`);

      return data;

    }

    /*  async function translateWeatherDescription(description) {
        const translation = await translate(description, { from: 'en', to: 'pl' });
        return translation;
  
      }
  */
    // Funkcja do rysowania na płótnie

    // Wczytaj czcionkę
    async function drawWeatherCanvas(city) {
      // Pobierz aktualne informacje o pogodzie
      const weatherData = await getCurrentWeather(city);

      // Wczytaj czcionkę

      // Utwórz nowe płótno
      const canvasWidth = 800;
      const canvasHeight = 400;
      const canvas = createCanvas(canvasWidth, canvasHeight);
      const context = canvas.getContext('2d');

      // Wczytaj tło

      // Sprawdź temperaturę i ustaw odpowiednie ikony oraz opisy
      const temperature = weatherData.main.temp;
      let temperatureText;
      let temperatureDescription;
      let temperatureIconPath;

      registerFont('./fonts/Roboto-Regular.ttf', { family: 'Roboto-Regular' })

      if (temperature < 20) {
        temperatureText = `${temperature}°C - Zimno`;
        temperatureDescription = 'Zimna pogoda';
        temperatureIconPath = './icons/termometr_zimno.png';
      } else {
        temperatureText = `${temperature}°C - Ciepło`;
        temperatureDescription = 'Ciepła pogoda';
        temperatureIconPath = './icons/termometr_cieplo.png';
      }
      // Narysuj ikonę temperatury
      const temperatureIcon = await loadImage(temperatureIconPath);
      const temperatureIconX = 40;
      const temperatureIconY = 80;
      context.drawImage(temperatureIcon, temperatureIconX, temperatureIconY);

      // Narysuj temperaturę
      const temperatureTextX = temperatureIconX + temperatureIcon.width + 20;
      const temperatureTextY = temperatureIconY + temperatureIcon.height - 20;
      context.fillStyle = 'white';
      context.font = '30px Roboto-Regular';
      context.fillText(temperatureText, temperatureTextX, temperatureTextY);

      // Narysuj informacje o temperaturze
      const temperatureDescriptionTextX = temperatureTextX;
      const temperatureDescriptionTextY = temperatureTextY + 40;
      context.font = '21px Roboto-Regular';
      context.fillText(temperatureDescription, temperatureDescriptionTextX, temperatureDescriptionTextY);

      // Narysuj ikonę wiatru
      const windIcon = await loadImage('./icons/wiatr.png');
      const windIconX = 40;
      const windIconY = temperatureIconY + temperatureIcon.height + 40;
      context.drawImage(windIcon, windIconX, windIconY);

      // Narysuj informacje o wietrze

      function getWindDirection(degrees) {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const index = Math.round(degrees / 45) % 8;
        return directions[index];
      }



      const windSpeed = weatherData.wind.speed;
      const windDirection = getWindDirection(weatherData.wind.deg);
      const windText = `Wiatr: ${windSpeed} m/s (${windDirection})`;
      const windTextX = windIconX + windIcon.width + 20;
      const windTextY = windIconY + windIcon.height - 20;
      context.fillText(windText, windTextX, windTextY);


      // Narysuj informacje o wschodzie i zachodzie słońca

      // Narysuj ikonę wschodu słońca
      const sunriseIcon = await loadImage('./icons/sunrise.png');
      const sunriseIconX = 40;
      const sunriseIconY = windIconY + windIcon.height + 40;
      context.drawImage(sunriseIcon, sunriseIconX, sunriseIconY);

      // Pobierz godziny wschodu i zachodu słońca
      const sunrise = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit'
      });
      const sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('pl-PL', {
        hour: '2-digit',
        minute: '2-digit'
      });

      // Narysuj informacje o wschodzie i zachodzie słońca
      const sunriseSunsetText = `Wschód: ${sunrise}`;
      const sunsetSunsetText = `Zachód: ${sunset}`;
      const sunriseSunsetIcon = await loadImage('./icons/sunrise.png');
      const sunriseSunsetIconX = sunriseIconX + sunriseIcon.width;
      const sunriseSunsetIconY = sunriseIconY;
      const sunriseSunsetTextX = sunriseSunsetIconX + sunriseSunsetIcon.width +20;
      const sunriseSunsetTextY = sunriseSunsetIconY + sunriseSunsetIcon.height - 20;

      context.fillText(sunriseSunsetText, sunriseSunsetTextX, sunriseSunsetTextY);

      // Narysuj ikonę zachodu słońca
      const sunsetIcon = await loadImage('./icons/sunset.png');
      const sunsetIconX = sunriseIconX;
      const sunsetIconY = sunriseSunsetTextY + 30;
      context.drawImage(sunsetIcon, sunsetIconX, sunsetIconY);

      // Narysuj informacje o zachodzie słońca
      const sunsetTextX = sunriseSunsetIconX +  sunriseSunsetIcon.width + 20;
      const sunsetTextY = sunriseSunsetTextY + 50;
      context.fillText(sunsetSunsetText, sunsetTextX, sunsetTextY);



      // Narysuj nazwę miejscowości
      const locationText = city;
      const locationTextX = canvasWidth - 20;
      const locationTextY = canvasHeight - 20;
      context.textAlign = 'right';
      context.fillText(locationText, locationTextX, locationTextY);



      // Pobierz buforowany obrazek z płótna
      const buffer = canvas.toBuffer();

      // Wyślij obrazek jako odpowiedź na interakcję
      return buffer;
    }

    const imageBuffer = await drawWeatherCanvas(city);
    const attachment = new AttachmentBuilder(imageBuffer, { name: 'weather.png' })

    const embed = new EmbedBuilder()
      .setTitle(`Pogoda: ${city}`)
      .setColor("#2b2d31")
      .setImage('attachment://weather.png')
      .setFooter({
        text: `Beta by @doniczka`
      });

    await interaction.deferReply({ embeds: [embed], files: [attachment] });
      await interaction.deleteReply({ embeds: [embed], files: [attachment]})
  }
}
