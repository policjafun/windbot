require('dotenv').config()
require('./mongo')()
const ascii = require('ascii-table')
const discord = require('discord.js');
const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const urlencodedParser = require('body-parser').urlencoded({ extended: false });
const fs = require('fs');
const DiscordOauth2 = require("discord-oauth2");
const connectDB = require('./mongo')
const logoUrl = '../Wind_dashboard/public/frontend/logo/wind_logo.png';
const client = new discord.Client({
  intents: [
    discord.GatewayIntentBits.Guilds,
    discord.GatewayIntentBits.GuildPresences,
    discord.GatewayIntentBits.GuildVoiceStates,
    discord.GatewayIntentBits.GuildMembers,
    discord.GatewayIntentBits.GuildMessages,
    discord.GatewayIntentBits.MessageContent,
    discord.GatewayIntentBits.DirectMessages
  ],
  allowedMentions: { parse: ['users', 'roles'], repliedUser: true }
});


const { QuickDB } = require("quick.db");
const db = new QuickDB()

const oauth = new DiscordOauth2({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: "http://localhost:90/callback",
});

app.enable("trust proxy"); // if the IP is ::1 it means localhost
app.set("etag", false); // disable cache
app.use(express.static(__dirname + "/public"));
app.set("views", __dirname);
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));



module.exports.client = client;

let files = fs.readdirSync("./public/backend").filter(ff => ff.endsWith(".js"));
const table = new ascii().setHeading("funkcja", "strona")

files.forEach(f => {

  const file = require(`./public/backend/${f}`);

  if (file && file.name) {

    app.get(file.name, file.run)


    if (file.run2) app.post(file.name, file.run2);


    return console.log(`Dashboard ${file.name}`)
  }
})

// Err pages 404
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/frontend/HTML/404.html');
});



client.login(process.env.TOKEN).then(console.log(`Logged In`));

app.listen(process.env.PORT || 90, () => console.log(`App on port ${process.env.PORT || 90}`));
