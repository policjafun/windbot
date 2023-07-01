const { PermissionsBitField, ChannelType, ButtonBuilder, EmbedBuilder, ButtonComponent, ActionRowBuilder, ButtonStyle } = require('discord.js');
const client = require('../../index').client;
const schema = require('../../models/dashboard');
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWTSECRET;
const weryfikacjaSchema = require('../../models/weryfikacja');

async function verify(req, res) {
    // Check if req.params.id exists and the guild with that ID exists in the cache
    if (!req.params.id || !client.guilds.cache.has(req.params.id)) {
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
        // Handle the error if token verification fails
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
    name: '/servers/:id/weryfikacja',
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

        const serwerdc = client.guilds.cache.get(guild.id);

        const channels = serwerdc?.channels.cache ? Array.from(
            serwerdc.channels.cache.values()
        ).filter(channel => channel.type === ChannelType.GuildText).map(channel => ({
            id: channel.id,
            name: channel.name,
            type: channel.type,
        })) : [];
        const roles = serwerdc?.roles.cache
            ? Array.from(serwerdc.roles.cache.values()).map((role) => ({
                id: role.id,
                name: role.name,
                color: role.color,
            }))
            : [];

        const args = {
            avatar: `https://cdn.discordapp.com/avatars/${data.userID}/${data.user.avatar}.png`,
            username: data.user.username,
            discriminator: data.user.discriminator,
            id: data.user.userID,
            guild: guild,
            error: false,
            channels: channels,
            roles: roles,
        };
        res.render("./public/frontend/HTML/id_weryfikacja.ejs", args);
    },

    run2: async (req, res) => {
        let verifyResult = await verify(req, res);
        if (!verifyResult.guild) return res.redirect('/servers');
        let { guild, member, data } = verifyResult;







        const { roleIdWeryfikacja, channelIdWeryfkacja, WeryfikacjaButtonColor, WeryfikacjaEmbedColor} = req.body;

        if (roleIdWeryfikacja && channelIdWeryfkacja && WeryfikacjaButtonColor && WeryfikacjaEmbedColor) {
            console.log(roleIdWeryfikacja)
        }

        if (roleIdWeryfikacja) {
            await weryfikacjaSchema.updateOne(
                { guildId: guild.id },
                { roleId: roleIdWeryfikacja },
                { upsert: true }
            );
        }

        const selectedChannel = client.channels.cache.get(channelIdWeryfkacja);

        if (selectedChannel) {
            const weryfikacjaEmbed = new EmbedBuilder()
                .setTitle("Weryfikacja")
                .setColor(`${WeryfikacjaEmbedColor}`)
                .setFooter({ text: `Beta by @doniczka` });

            const confirm = new ButtonBuilder()
                .setCustomId("weryfikacjabtn")
                .setLabel("Zweryfikuj się")
                .setStyle(`${WeryfikacjaButtonColor}`);

            const row = new ActionRowBuilder().addComponents(confirm);
            selectedChannel.send({
                embeds: [weryfikacjaEmbed],
                components: [row],
            });
        }
        const serwerdc = client.guilds.cache.get(guild.id);

        const channels = serwerdc?.channels.cache ? Array.from(
            serwerdc.channels.cache.values()
        ).filter(channel => channel.type === ChannelType.GuildText).map(channel => ({
            id: channel.id,
            name: channel.name,
            type: channel.type,
        })) : [];
        const roles = serwerdc?.roles.cache
            ? Array.from(serwerdc.roles.cache.values()).map((role) => ({
                id: role.id,
                name: role.name,
                color: role.color,
            }))
            : [];


        let informacja = "Informacje zostały wysłane na twój serwer discord";
        const args = {
            avatar: `https://cdn.discordapp.com/avatars/${data.userID}/${data.user.avatar}.png`,
            username: data.user.username,
            discriminator: data.user.discriminator,
            id: data.user.userID,
            guild: guild,
            error: false,
            channels: channels,
            roles: roles,
            informacja: informacja,
        };
        res.render("./public/frontend/HTML/id_weryfikacja.ejs", args);
    }
};
