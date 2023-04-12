const config = require("../config.json");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports.run = async (client, message, args) => {
  // Check if the message author is the bot's owner
  if (message.author.id !== config.ownerID) {
    return;
  }

  // Get the user mention from the command arguments
  const userMention = args[0];
  if (!userMention) {
    return message.reply("Please specify a user.");
  }

  // Extract the user ID from the mention
  const userID = userMention.replace(/<@!?(\d+)>/, "$1");

  // Validate user ID
  const user =
    message.guild.members.cache.get(userID) ||
    (await message.guild.members.fetch(userID).catch(() => null));
  if (!user) {
    return message.reply("Invalid user provided.");
  }

  // Check if the mentioned user is a bot
  if (user.user.bot) {
    return message.reply("You can't send messages to bots.");
  }

  // Get the message content from the command arguments
  const content = args.slice(1).join(" ");
  if (!content) {
    return message.reply("Please specify a message to send.");
  }

  // Validate message content
  if (content.length > 1024) {
    return message.reply(
      "Message content is too long. Maximum length is 1024 characters."
    );
  }

  // Create an embed message with the message content
  const embed = new MessageEmbed()
    .setTitle(
      `Message from the owner: ${message.author.username}#${message.author.discriminator}`
    )
    .setThumbnail(user.displayAvatarURL())
    .setDescription(
      `The owner sent you a message. Please read it carefully.\nYour messages will not be stored anywhere and you will be able to reply to this message if you want using the **/feedback** command.`
    )
    .addFields({
      name: "Here's the content of the message:",
      value: `>>> \`${content}\``,
      inline: true,
    })
    .setColor("RANDOM") // Set the color of the embed, you can change it to any valid color
    .setFooter({
      text: `The bot doesn't have access to your DM messages.`,
      iconURL: message.author.displayAvatarURL(),
    });

  // Create a row of buttons for confirmation
  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("confirm")
      .setLabel("Confirm")
      .setStyle("SUCCESS"),
    new MessageButton()
      .setCustomId("cancel")
      .setLabel("Cancel")
      .setStyle("DANGER")
  );

  // Send a confirmation message to the command invoker
  const confirmEmbed = new MessageEmbed()
    .setTitle("Confirm Message")
    .setDescription(
      `Are you sure you want to send the following message to ${user}?`
    )
    .addFields({
      name: "Message Content:",
      value: `>>> \`${content}\``,
      inline: true,
    })
    .setThumbnail(user.displayAvatarURL())
    .setColor("RANDOM"); // Set the color of the confirmation embed, you can change it to any valid color

  const confirmMessage = await message.reply({
    embeds: [confirmEmbed],
    components: [row],
  });

  // Await for user interaction
  const filter = (interaction) => interaction.user.id === message.author.id;
  const collector = confirmMessage.createMessageComponentCollector({
    filter,
    time: 15000,
  }); // Collect buttons for 15 seconds

  collector.on("collect", async (interaction) => {
    // Handle button interactions
    if (interaction.customId === "confirm") {
      // If user confirms, send the message
      await user.send({ embeds: [embed] }).catch(() => null);
      await interaction.update({ content: "Message sent!" }); // Update confirmation message
      row.components.forEach((c) => c.setDisabled(true));
      await confirmMessage.edit({ components: [row] });
    } else if (interaction.customId === "cancel") {
      // If user cancels, update confirmation message and delete original command message
      await interaction.update({ content: "Message sending cancelled." });
      row.components.forEach((c) => c.setDisabled(true));
      await confirmMessage.edit({ components: [row] });
    }
  });

  collector.on("end", async () => {
    row.components.forEach((c) => c.setDisabled(true));
    await confirmMessage.edit({ components: [row] });
  });
};
