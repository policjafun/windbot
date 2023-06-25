const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
  events: [{ type: String }],
  logEnabled: { type: Boolean, default: false },
});

module.exports = mongoose.model('LogSchema', logSchema);
