const mongoose = require("mongoose");

const giveawayBanSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  guildId: { type: String, required: true },
});

module.exports = mongoose.model("giveawayBan", giveawayBanSchema);
