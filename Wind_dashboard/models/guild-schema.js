const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  guildId: { type: String, required: true },
  prefix: { type: String, default: 'w!' },
  loggingOptions: [{
    channel: { type: String },
    events: [{ type: String }],
  }],
});

module.exports = mongoose.model('guildschema', schema);
