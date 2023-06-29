const { Client } = require("discord.js");
const { activityInterval, database } = require("../../../config.json");
const mongoose = require('mongoose');
const chalk = require('chalk');

module.exports = {
  name: "ready",
  once: true,
  /**
   * @param {Client} client
   */
  async execute(client) {
    /* Connect to database */
    if (!database) return;
    mongoose
      .connect(database)
      .then(() => console.log(chalk.green("db connected")))
      .catch((err) => console.error(err));

    console.log(
      `Zalogowano jako ${client.user.tag}, jestem na ${client.guilds.cache.size} serwerach`
    );
    updateActivity(client);
  },
};

/**
 * @param {Client} client
 */
async function updateActivity(client) {
  const activities = [
    "@doniczka",
  ];

  setInterval(() => {
    const status = activities[Math.floor(Math.random() * activities.length)];
    client.user.setActivity(status);
  }, activityInterval * 1000);
}
