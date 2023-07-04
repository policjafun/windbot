require('dotenv').config();
const crypto = require('crypto');
const schema = require('../../models/dashboard');
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWTSECRET;

module.exports = {
  name: '/login',
  run: async (req, res) => {

    

    const crypto = require('crypto');
    const DiscordOauth2 = require("discord-oauth2");
    const oauth = new DiscordOauth2({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      redirectUri: "http://windbot.cloud/callback",
    });

    const url = oauth.generateAuthUrl({
      scope: ["identify", "guilds"],
      state: crypto.randomBytes(16).toString("hex"),
    });

    if (!req.cookies.token || req.cookies.token.length === 0) {
      return res.redirect(url);
    }

    let decoded;
    try {
      decoded = jwt.verify(req.cookies.token, jwt_secret);
    } catch (e) {
      console.error(e);
      return res.redirect(url);
    }

    if (!decoded) {
      return res.redirect(url);
    }

    let data;
    try {
      data = await schema.findOne({ _id: decoded.uuid });
    } catch (e) {
      console.error(e);
      return res.redirect(url);
    }

    if (!data) {
      return res.redirect(url);
    }

    if (Date.now() - data.lastUpdated > data.expires_in * 1000) {
      try {
        const oauthData = await oauth.tokenRequest({
          refreshToken: data.refresh_token,
          grantType: "refresh_token",
          scope: ["identify"],
        });

        data.access_token = oauthData.access_token;
        data.refresh_token = oauthData.refresh_token;
        data.expires_in = oauthData.expires_in;

        await data.save();
      } catch (e) {
        console.error(e);
        return res.redirect(url);
      }
    }

    res.redirect('/servers');
  },
};
