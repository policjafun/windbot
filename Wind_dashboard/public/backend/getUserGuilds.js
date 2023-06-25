require('dotenv').config()
const Client = require("../../index").client
const schema = require('../../models/dashboard')
const jwt = require('jsonwebtoken')
const jwt_secret = process.env.JWTSECRET
const { PermissionsBitField, Presence } = require('discord.js'); // Dodano import Presence

const DiscordOauth2 = require("discord-oauth2");

module.exports = {
  name: "/getUserGuilds/",
  run: async (req, res) => {
    delete require.cache[require.resolve("../frontend/HTML/getUserGuilds.ejs")];

    const oauth = new DiscordOauth2({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      redirectUri: "http://localhost:90/callback",
    });

    if (!req.cookies.token) return res.redirect('/login')
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
    guildArray.forEach(g => {
      g.avatar = `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`;
      if (Client.guilds.cache.get(g.id)) {
        const bitPermissions = new PermissionsBitField(g.permissions_new);
        if (bitPermissions.has(PermissionsBitField.Flags.ManageGuild) || bitPermissions.has(PermissionsBitField.Flags.Administrator) || Client.guilds.cache.get(g.id).ownerId == data.userID) g.hasPerm = true
        mutualArray.push(g);
      } else g.hasPerm = false;
    });

    // Dodano pobranie obecności użytkownika
    const presence = Client.users.cache.get(data.userID)?.presence;
    const presenceStatus = presence?.status;
    const presenceActivities = presence?.activities;
    
    let args = {
      avatar: `https://cdn.discordapp.com/avatars/${data.userID}/${data.user.avatar}.png`,
      username: data.user.username,
      discriminator: data.user.discriminator,
      id: data.userID,
      loggedIN: true,
      guilds: guildArray,
      adminGuilds: mutualArray,
      presenceStatus: presenceStatus, // Dodano status obecności
      presenceActivities: presenceActivities, // Dodano aktywności obecności
    };

    res.render("./public/frontend/HTML/getUserGuilds.ejs", args);
  }
}
