const fs = require('fs');
const client = require('../../index').client;
const schema = require('../../models/dashboard.js');
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWTSECRET;

module.exports = {
  name: "/dashboard",
  run: async (req, res, next) => {
    delete require.cache[require.resolve("../frontend/HTML/dashboard.ejs")];
    if (!req.cookies.token) return res.redirect('/login');

    let decoded;
    try {
      decoded = jwt.verify(req.cookies.token, jwt_secret);
    } catch (e) {
      console.error("Error verifying JWT token:", e);
      // Handle verification error
    }

    if (decoded) { // Token is valid
      let data;
      try {
        data = await schema.findOne({
          _id: decoded.uuid,
         userID: decoded.userID
        });
      } catch (e) {
        console.error("Error retrieving data from database:", e);
        // Handle database error
      }
      if (data) { 

      if (data.user.discriminator == 0) { 
        let args = {
        avatar: `https://cdn.discordapp.com/avatars/${data.userID}/${data.user.avatar}.png`,
        username: data.user.username,
        discriminator: "",
        id: data.user.userID,
        loggedIN: true,
        users: client.guilds.cache.reduce((a, g) => a + g.memberCount, 0).toLocaleString(),
        guilds: client.guilds.cache.size,
        latency: client.ws.ping
        }
        res.render("./public/frontend/HTML/dashboard.ejs", args);
      } else {
    
        let args = {
          avatar: `https://cdn.discordapp.com/avatars/${data.userID}/${data.user.avatar}.png`,
          username: data.user.username,
          discriminator: "#"+ data.user.discriminator,
          id: data.user.userID,
          loggedIN: true,
          users: client.guilds.cache.reduce((a, g) => a + g.memberCount, 0).toLocaleString(),
          guilds: client.guilds.cache.size,
          latency: client.ws.ping
          
        };
        res.render("./public/frontend/HTML/dashboard.ejs", args);
      }
      
      } else {
        console.log("Data not found in database.");
        res.redirect("/login");
      }
    } else {
      console.log("Invalid or expired token.");
      res.redirect("/login");
    }
  }
};
