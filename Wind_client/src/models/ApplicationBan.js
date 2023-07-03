const mongoose = require('mongoose');

const appBanSchema = new mongoose.Schema({
  UserId: { type: String },
  ifa: { type: Boolean, default: false},
  reason: { type: String}
});

module.exports = mongoose.model('AppBan', appBanSchema);
