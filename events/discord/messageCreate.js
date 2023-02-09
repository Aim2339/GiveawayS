const messageCount = require("../../schema/messageCount");

module.exports = (client, message) => {
  // Ignore messages sent by bots
  if (message.author.bot) return;

  // check if the document already exist
  messageCount.findOne(
    { userId: message.author.id, guildId: message.guild.id },
    function (err, doc) {
      if (err) {
        return;
      }
      if (!doc) {
        // create new document with count = 1
        messageCount.create(
          { userId: message.author.id, guildId: message.guild.id, count: 1 },
          function (err) {
            if (err) {
              return;
            }
          }
        );
      } else {
        // increment the count by 1
        messageCount.findOneAndUpdate(
          { userId: message.author.id, guildId: message.guild.id },
          { $inc: { count: 1 } },
          function (err) {
            if (err) {
              return;
            }
          }
        );
      }
    }
  );
};
