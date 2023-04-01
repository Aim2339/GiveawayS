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

  if (
    message.mentions.has(client.user) &&
    !message.mentions.everyone &&
    !message.content.includes("@here") &&
    !message.reference
  ) {
    // Reply to the message with a custom response
    message.reply(
      `Hello, ${message.author.username}! I use slash commands. Try \`/help\`!`
    );
  }
  // return if message does not match prefix (in command)
  if (message.content.indexOf(client.config.prefix) !== 0) return;

  // Defining what are arguments and commands
  const args = message.content
    .slice(client.config.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  // Get the command data from the client.commands Enmap
  const cmd = client.commands.get(command);

  // If command does not exist return
  if (!cmd) return;

  // Run the command
  cmd.run(client, message, args);
};
