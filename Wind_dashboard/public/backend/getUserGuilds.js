require('dotenv').config();
const Client = require("../../index").client;
const schema = require('../../models/dashboard');
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWTSECRET;
const { PermissionsBitField, Presence } = require('discord.js');
const DiscordOauth2 = require("discord-oauth2");

module.exports = {
  name: "/servers/",
  run: async (req, res) => {
    delete require.cache[require.resolve("../frontend/HTML/getUserGuilds.ejs")];

    const oauth = new DiscordOauth2({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      redirectUri: "http://localhost:90/callback",
    });

    if (!req.cookies.token) return res.redirect('/login');
    let decoded;
    try {
      decoded = jwt.verify(req.cookies.token, jwt_secret);
    } catch (e) {
      console.error('Error verifying JWT token:', e);
    }
    if (!decoded) res.redirect("/login");

    let data = await schema.findOne({
      _id: decoded.uuid,
      userID: decoded.userID
    });
    if (!data) res.redirect("/login");

    let guildArray = await oauth.getUserGuilds(data.access_token);
    let mutualArray = [];
    let noBotGuilds = [];

    for (const g of guildArray) {
      g.avatar = `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`;
      const bitPermissions = new PermissionsBitField(g.permissions);
      if (
        bitPermissions.has(PermissionsBitField.Flags.ManageGuild) ||
        bitPermissions.has(PermissionsBitField.Flags.Administrator)
      ) {
        g.hasPerm = true;
        if (Client.guilds.cache.has(g.id)) {
          mutualArray.push(g);
        } else {
          if (!noBotGuilds.some((guild) => guild.id === g.id)) {
            noBotGuilds.push(g);
          }
        }
      }
    }

    // Sortowanie serwerów z botem na górze
    mutualArray.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    // Sortowanie serwerów bez bota na dole
    noBotGuilds.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });


    let args = {
      avatar: `https://cdn.discordapp.com/avatars/${data.userID}/${data.user.avatar}.png`,
      username: data.user.username,
      discriminator: data.user.discriminator,
      id: data.userID,
      loggedIN: true,
      guilds: guildArray,
      adminGuilds: mutualArray,
      noBotGuilds: noBotGuilds,
    };

    res.render("./public/frontend/HTML/getUserGuilds.ejs", args);
  }
};
