const { PermissionsBitField, ChannelType, Guild, ButtonBuilder, EmbedBuilder, ButtonComponent, ActionRowBuilder, ButtonStyle } = require('discord.js');
const client = require('../../index').client;
const schema = require('../../models/dashboard');
const datastats = require('../../models/statystykiSchema')
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWTSECRET;

async function verify(req, res) {
    if (!req.params.id || !client.guilds.cache.has(req.params.id)) {
        console.log("przeniesiono na /servers");
        return {
            guild: null,
            member: null,
            data: null,
        };
    }

    if (!req.cookies.token) {
        return res.redirect('/login');
    }

    let decoded;
    try {
        decoded = jwt.verify(req.cookies.token, jwt_secret);
    } catch (e) {
        console.error(e);
        return res.redirect("/login");
    }

    if (!decoded) {
        return res.redirect("/login");
    }

    let data = await schema.findOne({
        _id: decoded.uuid,
        userID: decoded.userID,
    });

    if (!data) {
        return res.redirect("/login");
    }

    const guild = client.guilds.cache.get(req.params.id);
    if (!guild) {
        return res.redirect('/servers');
    }

    const member = await guild.members.fetch(data.userID);
    if (!member) {
        return res.redirect('/servers');
    }

    return {
        guild: guild,
        member: member,
        data: data,
    };
}

module.exports = {
    name: '/servers/:id/statystyki',
    run: async (req, res) => {
        let verifyResult = await verify(req, res);
        if (!verifyResult.guild) return res.redirect('/servers');
        let { guild, member, data } = verifyResult;

        if (
            !member.permissions.has(PermissionsBitField.Flags.ManageGuild) &&
            !member.permissions.has(PermissionsBitField.Flags.Administrator) &&
            guild.ownerId !== data.userID
        ) {
            return res.redirect('/servers');
        }
        await guild.fetch({ force: true });

        let existingData = await datastats.findOne({ guildId: guild.id });
        if (existingData) {

            if (existingData.MemberCountMessage && existingData.MemberCountChannel) {
                const guild1 = client.guilds.cache.get(req.params.id)
                const MemberCountChannelID = guild1.channels.cache.get(existingData.MemberCountChannel);
                const MemberCountChannel = MemberCountChannelID.name;
                const MemberCountMessage = existingData.MemberCountMessage;
                const serwerdc = client.guilds.cache.get(guild.id);
                const channels = serwerdc?.channels.cache ? Array.from(
                    serwerdc.channels.cache.values()
                ).filter(channel => channel.type === ChannelType.GuildVoice).map(channel => ({
                    id: channel.id,
                    name: channel.name,
                    type: channel.type,
                })) : [];



                const args = {
                    avatar: `https://cdn.discordapp.com/avatars/${data.userID}/${data.user.avatar}.png`,
                    username: data.user.username,
                    discriminator: data.user.discriminator,
                    id: data.user.userID,
                    guild: guild,
                    error: false,
                    channels: channels,
                    client: client,
                    MemberCountMessage: MemberCountMessage.replace("{MemberCount}", guild1.memberCount),
                    MemberCountChannel: MemberCountChannel
                };

                res.render("./public/frontend/HTML/id_statystyki.ejs", args);
            }
        } else {
            const serwerdc = client.guilds.cache.get(guild.id);

            const channels = serwerdc?.channels.cache ? Array.from(
                serwerdc.channels.cache.values()
            ).filter(channel => channel.type === ChannelType.GuildVoice).map(channel => ({
                id: channel.id,
                name: channel.name,
                type: channel.type,
            })) : [];

            const args = {
                avatar: `https://cdn.discordapp.com/avatars/${data.userID}/${data.user.avatar}.png`,
                username: data.user.username,
                discriminator: data.user.discriminator,
                id: data.user.userID,
                guild: guild,
                error: false,
                channels: channels,
                client: client,
                MemberCountChannel: "Wybierz kanał",
                MemberCountMessage: "Wpisz treść wiadomośći",
            };
            res.render("./public/frontend/HTML/id_statystyki.ejs", args);
        }


    },

    run2: async (req, res) => {
        let verifyResult = await verify(req, res);
        if (!verifyResult.guild) return res.redirect('/servers');
        let { guild, member, data } = verifyResult;


        const { MemberCountMessage, MemberCountChannel, newpersonmessage, newpersonchannel, presencecountermessage, presencecounter } = req.body;

        // Get existing data document or create a new one
        let existingData = await datastats.findOne({ guildId: guild.id });
        if (!existingData) {
            existingData = await datastats.create({ guildId: guild.id });
        }

        // Update data properties if values are provided
        if (MemberCountMessage && MemberCountChannel) {
            existingData.MemberCountMessage = MemberCountMessage;
            existingData.MemberCountChannel = MemberCountChannel;
        }
        if (newpersonmessage && newpersonchannel) {
            existingData.newpersonmessage = newpersonmessage;
            existingData.newpersonchannel = newpersonchannel;
        }
        if (presencecountermessage && presencecounter) {
            existingData.presencecountermessage = presencecountermessage;
            existingData.presencecounter = presencecounter;
        }

        // Save the updated data document
        try {
            await existingData.save();
            console.log('Data saved successfully:', existingData);
        } catch (error) {
            console.error('Error while saving data:', error);
        }





        if (existingData) {
            if (existingData.presencecounter && existingData.presencecountermessage) {
                const guild1 = client.guilds.cache.get(req.paramas.id)
                
                const serwerdc = client.guilds.cache.get(guild.id);
                const channels = serwerdc?.channels.cache ? Array.from(
                    serwerdc.channels.cache.values()
                ).filter(channel => channel.type === ChannelType.GuildVoice).map(channel => ({
                    id: channel.id,
                    name: channel.name,
                    type: channel.type,
                })) : [];

            }
            if (existingData.MemberCountMessage && existingData.MemberCountChannel) {
                const guild1 = client.guilds.cache.get(req.params.id)
                const MemberCountChannelID = guild1.channels.cache.get(existingData.MemberCountChannel);
                const existingMemberCountChannel = MemberCountChannelID.name;
                const existingMemberCountMessage = MemberCountMessage;
                const serwerdc = client.guilds.cache.get(guild.id);
                const channels = serwerdc?.channels.cache ? Array.from(
                    serwerdc.channels.cache.values()
                ).filter(channel => channel.type === ChannelType.GuildVoice).map(channel => ({
                    id: channel.id,
                    name: channel.name,
                    type: channel.type,
                })) : [];



                const args = {
                    avatar: `https://cdn.discordapp.com/avatars/${data.userID}/${data.user.avatar}.png`,
                    username: data.user.username,
                    discriminator: data.user.discriminator,
                    id: data.user.userID,
                    guild: guild,
                    error: false,
                    channels: channels,
                    client: client,
                    MemberCountMessage: existingMemberCountChannel,
                    MemberCountChannel: existingMemberCountMessage.replace("{MemberCount}", guild1.memberCount),
                };

                res.render("./public/frontend/HTML/id_statystyki.ejs", args);

            } else {
                const serwerdc = client.guilds.cache.get(guild.id);

                const channels = serwerdc?.channels.cache ? Array.from(
                    serwerdc.channels.cache.values()
                ).filter(channel => channel.type === ChannelType.GuildVoice).map(channel => ({
                    id: channel.id,
                    name: channel.name,
                    type: channel.type,
                })) : [];

                const args = {
                    avatar: `https://cdn.discordapp.com/avatars/${data.userID}/${data.user.avatar}.png`,
                    username: data.user.username,
                    discriminator: data.user.discriminator,
                    id: data.user.userID,
                    guild: guild,
                    error: false,
                    channels: channels,
                    client: client,
                    MemberCountMessage: "Wpisz treść wiadomośći",
                    MemberCountChannel: "Wybierz kanał",
                };
                res.render("./public/frontend/HTML/id_statystyki.ejs", args);
            }
        }
    },
};
