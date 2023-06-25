const client = require('../../index').client;

module.exports = {
  name: '/',
  run: async (req, res) => {

    delete require.cache[require.resolve("../frontend/HTML/home.ejs")];

    let args = {
      users: client.guilds.cache.reduce((a, g) => a + g.memberCount, 0).toLocaleString(),
      guilds: client.guilds.cache.size,
      latency: client.ws.ping
    };

    res.render("./public/frontend/HTML/home.ejs", args);

  }
}; 
