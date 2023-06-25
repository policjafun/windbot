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
  
      // Ścieżki do plików czcionek i ikon pogody
      const fontPath = __dirname + '../../../Structures/Roboto-Regular.ttf';
  
      const weatherIconsPath = __dirname + '/weather-icons/';
  
  
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
      async function drawWeatherCanvas(city) {
        // Pobierz aktualne informacje o pogodzie
        const weatherData = await getCurrentWeather(city);
  
        // Wczytaj czcionkę
        registerFont('./fonts/Roboto-Medium.ttf', {family: 'Roboto-Regular'})
  
        // Utwórz nowe płótno
        const canvasWidth = 400;
        const canvasHeight = 200;
        const canvas = createCanvas(canvasWidth, canvasHeight);
        const context = canvas.getContext('2d');
  
        // Rysuj tło gradientowe
        // Rysuj tło gradientowe
        const gradient = context.createLinearGradient(0, 0, 0, canvasHeight);
        gradient.addColorStop(0, '#00b4db');
        gradient.addColorStop(1, '#0083b0');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvasWidth, canvasHeight);
      
        // Ustawienia stylu tekstu
        context.fillStyle = 'white';
        context.font = '24px Roboto';
      
        // Narysuj temperaturę
        const temperature = weatherData.main.temp.toFixed(1);
        const temperatureText = `${temperature}°C`;
        const temperatureTextWidth = context.measureText(temperatureText).width;
        const temperatureTextX = (canvasWidth - temperatureTextWidth) / 2;
        const temperatureTextY = 60;
        context.fillText(temperatureText, temperatureTextX, temperatureTextY);
      
        // Ustawienia stylu tekstu dla opisu pogody
        context.font = '16px Roboto';
      
        // Narysuj opis pogody
        const weatherDescription = weatherData.weather[0].description;
        const weatherDescriptionTextWidth = context.measureText(weatherDescription).width;
        const weatherDescriptionTextX = (canvasWidth - weatherDescriptionTextWidth) / 2;
        const weatherDescriptionTextY = 100;
        context.fillText(weatherDescription, weatherDescriptionTextX, weatherDescriptionTextY);
      
        // Wczytaj ikonę pogody
        const weatherIconCode = weatherData.weather[0].icon;
        const weatherIconBuffer = await getWeatherIcon(weatherIconCode);
        const weatherIcon = await loadImage(weatherIconBuffer);
      
        // Narysuj ikonę pogody
        const weatherIconX = (canvasWidth - weatherIcon.width) / 2;
        const weatherIconY = 120;
        context.drawImage(weatherIcon, weatherIconX, weatherIconY, weatherIcon.width, weatherIcon.height);
      
        // Ustawienia stylu tekstu dla nazwy miejscowości
        context.font = '16px Roboto';
      
        // Narysuj nazwę miejscowości
        const locationText = city;
        const locationTextWidth = context.measureText(locationText).width;
        const locationTextX = (canvasWidth - locationTextWidth) / 2;
        const locationTextY = 160;
        context.fillText(locationText, locationTextX, locationTextY);
      
        // Dodaj informacje o wietrze i wschodzie/zachodzie słońca
        const windSpeed = weatherData.wind.speed;
        const windDirection = getWindDirection(weatherData.wind.deg);
        const sunrise = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
        const sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
      
        function getWindDirection(degrees) {
          const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
          const index = Math.round(degrees / 45) % 8;
          return directions[index];
        }
        
  
        // Dodaj tekst informacji o wietrze
        const windText = `Wiatr: ${windSpeed} m/s (${windDirection})`;
        const windTextWidth = context.measureText(windText).width;
        const windTextX = (canvasWidth - windTextWidth) / 2;
        const windTextY = 140;
        context.fillText(windText, windTextX, windTextY);
      
        // Dodaj tekst informacji o wschodzie i zachodzie słońca
        const sunriseSunsetText = `Wschód: ${sunrise}  Zachód: ${sunset}`;
        const sunriseSunsetTextWidth = context.measureText(sunriseSunsetText).width;
        const sunriseSunsetTextX = (canvasWidth - sunriseSunsetTextWidth) / 2;
        const sunriseSunsetTextY = 180;
        context.fillText(sunriseSunsetText, sunriseSunsetTextX, sunriseSunsetTextY);
      
        // Pobierz buforowany obrazek z płótna
        
        const buffer = canvas.toBuffer()
  
        // Wyślij obrazek jako odpowiedź na interakcję
        return buffer;
      } 
  
      const imageBuffer = await drawWeatherCanvas(city);
      const attachment = new AttachmentBuilder(imageBuffer, { name: 'weather.png' })
  
      const embed = new EmbedBuilder()
        .setTitle(`Pogoda: ${city}`)
        .setImage('attachment://weather.png')
        .setFooter({
          text: `Beta by @doniczka`
        });
  
      await interaction.reply({ embeds: [embed], files: [attachment] });
  
    }
  }  