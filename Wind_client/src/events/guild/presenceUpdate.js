const { GuildMember, Client } = require("discord.js");
const WelcomeSchema = require("../../models/welcomeSchema");
const datastats = require("../../models/statystykiSchema");

module.exports = {
  name: "presenceUpdate",
  /**
   * @param {GuildMember} oldMember
   * @param {GuildMember} newMember
   */
  async execute(oldMember, newMember) {
    const { user, guild } = newMember;


    console.log(newMember.user.username)
  }
};
