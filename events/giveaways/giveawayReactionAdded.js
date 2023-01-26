const Discord = require("discord.js");
const MessageCount = require("../../schema/messageCount");

module.exports = {
  async execute(giveaway, reactor, messageReaction) {
    let approved = new Discord.MessageEmbed()
      .setTimestamp()
      .setColor("RANDOM")
      .setTitle(
        ":white_check_mark: Entry Approved! | You have a chance to win!!"
      )
      .setDescription(
        `Your entry to [This Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) has been approved!`
      );

    let denied = new Discord.MessageEmbed()
      .setTimestamp()
      .setColor("RANDOM")
      .setTitle(":x: Entry Denied | Databse Entry Not Found & Returned!")
      .setDescription(
        `Your entry to [This Giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId}) has been denied, please review the requirements to the giveaway properly.`
      );

    let client = messageReaction.message.client;
    if (reactor.user.bot) return;
    if (giveaway.extraData) {
      if (
        giveaway.extraData.role !== "null" &&
        !reactor.roles.cache.get(giveaway.extraData.role)
      ) {
        messageReaction.users.remove(reactor.user);
        return reactor
          .send({
            embeds: [denied],
          })
          .catch((e) => {});
      }

      if (giveaway.extraData.activeBonus) {
        // Retrieve the message count for the user
        const messageCountDoc = await MessageCount.findOne({
          userId: reactor.id,
          guildId: reactor.guild.id,
        }).exec();
        if (!messageCountDoc) {
          return; // document not found, do nothing
        }
        const messageCount = messageCountDoc.count;
        if (messageCount === 0) {
          return; // message count is 0, do nothing
        }

        // Calculate the active bonus percentage
        const activeBonus = Math.min(messageCount / 50, 0.5);

        // Send a DM to the user with the active bonus information
        return reactor
          .send({
            embeds: [
              new Discord.MessageEmbed()
                .setTimestamp()
                .setColor("RANDOM")
                .setTitle(":white_check_mark: Active Bonus Entry Approved!")
                .setDescription(
                  `You have received an active bonus entry for this giveaway based on your message count! You will receive ${activeBonus} bonus entries and you have sent a total of ${messageCount} messages in this guild.`
                ),
            ],
          })
          .catch((e) => {});
      } else {
        return reactor
          .send({
            embeds: [approved],
          })
          .catch((e) => {});
      }
    } else {
      return reactor
        .send({
          embeds: [approved],
        })
        .catch((e) => {});
    }
  },
};
