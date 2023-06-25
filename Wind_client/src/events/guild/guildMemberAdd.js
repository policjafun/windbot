const { GuildMember, Client } = require("discord.js");
const WelcomeSchema = require("../../models/WelcomeSchema");

module.exports = {
  name: "guildMemberAdd",
  /**
   * @param {GuildMember} member
   * @param {Client} client
   */
  async execute(member) {
    const { user, guild } = member;
  
    const data = await WelcomeSchema.findOne({ guildId: guild.id });

    if (!data) return;

    const channel = data.channelId;
    const welcomeChannel = guild.channels.cache.get(channel);

    if (!welcomeChannel) return;

    welcomeChannel.send({ content: `Witaj, ${member.user.username} na ${member.guild.name}, ${guild.memberCount}` });

  }
};
