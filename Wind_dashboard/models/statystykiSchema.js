const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    MemberCountMessage: { type: String, required: false },
    MemberCountChannel: { type: String, required: false },
    newpersonmessage: { type: String, required: false },
    newpersonchannel: { type: String, required: false },
    presencecountermessage: { type: String, required: false },
    presencecounter: { type: String, required: false }
});

module.exports = mongoose.model('statystyki', statsSchema, 'statystykiSchema');
