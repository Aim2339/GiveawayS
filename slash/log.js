const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "log",
  description: "Set up a log channel",
  run: async (client, interaction) => {
    if (
      !interaction.member.permissions.has("MANAGE_MESSAGES") &&
      !interaction.member.roles.cache.some((r) => r.name === "Giveaways")
    ) {
      return interaction.reply({
        content:
          ":x: You need to have the manage messages permissions to start giveaways.",
        ephemeral: true,
      });
    }

    interaction.guild.channels.create("giveaway-log", {
      type: "text",
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone, //To make it be seen by a certain role, user an ID instead
          allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"], //Allow permissions
          deny: ["SEND_MESSAGES"], //Deny permissions
        },
      ],
    });
    const logChannel = interaction.guild.channels.cache.find(
      (channel) => channel.name === "giveaway-log"
    );

    if (logChannel) {
      logChannel.send(
        "**This channel has been set up for receiving giveaway logs!**"
      );
    } else {
      return;
    }

    interaction.reply({
      content: `Created a channel ${logChannel} in this server!\n1. Please don't edit the name of the channel else it won't work!\n2. If you want to stop the giveaway log in that channel then edit the name or manually delete it!\n3. If 2 channels were made delete the one where a message hasn't been sent by the bot!`,
      ephermal: true,
    });
  },
};
