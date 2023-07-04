const { PermissionsBitField, ChannelType, ButtonBuilder, EmbedBuilder, ButtonComponent, ActionRowBuilder, ButtonStyle } = require('discord.js');

const client = require("../../index").client;
const schema = require('../../models/dashboard');
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWTSECRET;
const GuildSchema = require('../../models/guild-schema');
const WelcomeSchema = require('../../models/welcomeSchema.js');
const weryfikacjaSchema = require('../../models/weryfikacja');

module.exports = {
  name: "/servers/:id",
  run: async (req, res) => {
    let verifyResult = await verify(req, res);
    if (!verifyResult.guild) return res.redirect('/servers');
    let { guild, member, data } = verifyResult;

    if (
      !member.permissions.has(PermissionsBitField.Flags.ManageGuild) &&
      !member.permissions.has(PermissionsBitField.Flags.Administrator) &&
      client.guilds.cache.get(guild.id).ownerId !== data.userID
    )
      return res.redirect('/servers');

    await guild.fetch({ force: true });
    let guildData = await GuildSchema.findOne({ guildId: guild.id });

    const serwerdc = client.guilds.cache.get(guild.id);
    const channels = serwerdc?.channels.cache ? Array.from(
      serwerdc.channels.cache.values()
    ).filter(channel => channel.type === ChannelType.GuildText).map(channel => ({
      id: channel.id,
      name: channel.name,
      type: channel.type,
    })) : [];

    const roles = serwerdc?.roles.cache ? Array.from(
      serwerdc.roles.cache.values()
    ).map(role => ({
      id: role.id,
      name: role.name,
      color: role.color,
    })) : [];

    const channelId = guildData?.loggingOptions?.channel || "";
    const events = guildData?.loggingOptions?.events || [];
    const logEnabled = guildData?.loggingOptions?.logEnabled || "";

    let args = {
      avatar: `https://cdn.discordapp.com/avatars/${data.userID}/${data.user.avatar}.png`,
      username: data.user.username,
      discriminator: data.user.discriminator,
      id: data.user.userID,
      guild: guild,
      error: false,
      channels: channels,
      selectedChannelId: channelId,
      selectedEvents: events,
      logEnabled: logEnabled,
      roles: roles
    };

    res.render("./public/frontend/HTML/getUserGuilds2.ejs", args);
  },

  run2: async (req, res) => {
    let { guild, member, data } = await verify(req, res);

    const { channelId, events, logEnabled, channelIdLogi, channelIdLevel, ChannelLevelEnabled, welcomeMessage, ticketMessage, channelIdTicket, channelIdWeryfkacja, roleIdWeryfikacja } = req.body;
    console.log('Channel ID:', channelId);
    console.log('logi', channelIdLogi);
    console.log('Events:', events);
    console.log('Log Enabled:', logEnabled);
    console.log('Level channel:', channelIdLevel);
    console.log('Level Enabled:', ChannelLevelEnabled);
    console.log('Welcome Message:', welcomeMessage);

    let guildData = await GuildSchema.findOne({ guildId: guild.id });
    if (!guildData) {
      guildData = new GuildSchema({ guildId: guild.id });
    }

    guildData.loggingOptions = {
      ...guildData.loggingOptions,
      channel: channelId,
      events: events,
      logEnabled: logEnabled,
    };

    await guildData.save();

    const serwerdc = client.guilds.cache.get(guild.id);
    const channels = serwerdc?.channels.cache
      ? Array.from(serwerdc.channels.cache.values()).filter(
          (channel) => channel.type === ChannelType.GuildText
        ).map((channel) => ({
          id: channel.id,
          name: channel.name,
          type: channel.type,
        }))
      : [];

    const roles = serwerdc?.roles.cache
      ? Array.from(serwerdc.roles.cache.values()).map((role) => ({
          id: role.id,
          name: role.name,
          color: role.color,
        }))
      : [];

    let args = {
      avatar: `https://cdn.discordapp.com/avatars/${data.userID}/${data.user.avatar}.png`,
      username: data.user.username,
      discriminator: data.user.discriminator,
      id: data.user.userID,
      guild: guild,
      error: false,
      channels: channels,
      selectedChannelId: channelId,
      selectedEvents: events,
      logEnabled: logEnabled,
      roles: roles,
    };

    if (roleIdWeryfikacja) {
      await weryfikacjaSchema.updateOne(
        { guildId: guild.id },
        { roleId: roleIdWeryfikacja },
        { upsert: true }
      );
    }

    const selectedWeryfikacjaChannel = guild.channels.cache.get(
      channelIdWeryfkacja
    );

    if (selectedWeryfikacjaChannel) {
      const weryfikacjaEmbed = new EmbedBuilder()
        .setTitle("Weryfikacja")
        .setColor("#21B2AD")
        .setFooter({ text: `Beta by @doniczka` });

      const confirm = new ButtonBuilder()
        .setCustomId("weryfikacjabtn")
        .setLabel("Zweryfikuj sie")
        .setStyle(ButtonStyle.Success);

      const row = new ActionRowBuilder().addComponents(confirm);
      selectedWeryfikacjaChannel.send({
        embeds: [weryfikacjaEmbed],
        components: [row],
      });
    }

    const selectedChannel = guild.channels.cache.get(channelIdTicket);

    if (selectedChannel) {
      const ticketEmbed = new EmbedBuilder()
        .setTitle("okok")
        .setColor("#21B2AD")
        .setFooter({ text: `Beta by @doniczka` });

      const confirm = new ButtonBuilder()
        .setCustomId("newticket")
        .setLabel("Stworz Ticket")
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder().addComponents(confirm);
      selectedChannel.send({ embeds: [ticketEmbed], components: [row] });
    }

    res.render("./public/frontend/HTML/getUserGuilds2.ejs", args);
  },
};

async function verify(req, res) {
  console.log(req.params.id);

  if (!req.params.id || !client.guilds.cache.has(req.params.id)) {
    console.log("przeniesiono na /servers");
    return {
      guild: null,
      member: null,
      data: null,
    };
  }

  if (!req.cookies.token) return res.redirect('/login');

  let decoded;
  try {
    decoded = jwt.verify(req.cookies.token, jwt_secret);
  } catch (e) {}

  if (!decoded) res.redirect("/login");

  let data = await schema.findOne({
    _id: decoded.uuid,
    userID: decoded.userID,
  });

  if (!data) res.redirect("/login");

  const guild = client.guilds.cache.get(req.params.id);
  if (!guild) return res.redirect('/servers');

  const member = await guild.members.fetch(data.userID);
  if (!member) return res.redirect('/servers');

  return {
    guild: guild,
    member: member,
    data: data,
  };
}
