require('dotenv').config();

const schema = require('../../models/dashboard');
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWTSECRET;
const DiscordOauth2 = require("discord-oauth2");

module.exports = {
  name: '/callback',
  run: async (req, res) => { 
    const oauth = new DiscordOauth2({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      redirectUri: "http://localhost:90/callback",
    });0

    console.log("Callback endpoint reached.");

    if (!req.query.code) {
      return res.redirect('/login');
    }

    let oauthData;
    try {
      console.log("Exchanging authorization code for access token.");
      oauthData = await oauth.tokenRequest({
        code: req.query.code,
        scope: "identify",
        grantType: "authorization_code"
      });
      console.log("Access token obtained:", oauthData.access_token);
    } catch (e) {
      console.error("Error exchanging authorization code:", e);
      return res.redirect('/login');
    }

    const user = await oauth.getUser(oauthData.access_token);
    console.log("User data retrieved:", user);

    let data = await schema.findOne({ userID: user.id });

    if (!data) {
      console.log("Creating new dashboard data for user:", user.id);
      data = new schema({ userID: user.id });
    }

    const id = data._id.toString();
    data.access_token = oauthData.access_token;
    data.refresh_token = oauthData.refresh_token;
    data.expires_in = oauthData.expires_in;
    data.secretAccessKey = jwt.sign({ userID: user.id, uuid: id }, jwt_secret);
    data.user = {
      id: user.id,
      username: user.username,
      discriminator: user.discriminator,
      avatar: user.avatar
    };

    await data.save(); 
    console.log("Dashboard data saved:", data);

    res.cookie('token', data.secretAccessKey, { maxAge: 835000 });
    console.log("Token cookie set:", data.secretAccessKey);

    res.end("<script>window.location.href='/servers';</script>");
  }
};
