const { GuildMember, Client } = require("discord.js");
const WelcomeSchema = require("../../models/welcomeSchema");
const datastats = require("../../models/statystykiSchema");

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

    const statsData = await datastats.findOne({ guildId: guild.id });

    if (statsData && statsData.newpersonchannel && statsData.newpersonmessage) {
      const newPersonChannelId = statsData.newpersonchannel;
      const newPersonMessage = statsData.newpersonmessage.replace("{NewPerson}", member.user.username);

      const newPersonChannel = guild.channels.cache.get(newPersonChannelId);

      if (newPersonChannel) {
        newPersonChannel.edit({ name: `${newPersonMessage}` })
      }
    }

    if (statsData && statsData.MemberCountMessage && statsData.MemberCountChannel) {
      const membercountchannelid = statsData.MemberCountChannel;
      const membercountmessage = statsData.MemberCountMessage.replace("{MemberCount}", guild.memberCount);
      const membercountchannel2 = guild.channels.cache.get(membercountchannelid);
       

      if(membercountchannel2) {
        membercountchannel2.edit({ name: `${membercountmessage}`})
      }

    }
  }
};
