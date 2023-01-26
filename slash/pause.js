module.exports = {
  name: "pause",
  description: "⏸ Pause a giveaway",

  options: [
    {
      name: "giveaway",
      description: "The giveaway to pause (message ID or giveaway prize)",
      type: "STRING",
      required: true,
    },
  ],

  run: async (client, interaction) => {
    // If the member doesn't have enough permissions
    if (
      !interaction.member.permissions.has("MANAGE_MESSAGES") &&
      !interaction.member.roles.cache.some((r) => r.name === "Giveaways")
    ) {
      return interaction.reply({
        content:
          ":x: You need to have the manage messages permissions to pause giveaways.",
        ephemeral: true,
      });
    }

    const query = interaction.options.getString("giveaway");

    const logChannel = interaction.guild.channels.cache.find(
      (channel) => channel.name === "giveaway-log"
    );

    // try to find the giveaway with prize alternatively with ID
    const giveaway =
      // Search with giveaway prize
      client.giveawaysManager.giveaways.find(
        (g) => g.prize === query && g.guildId === interaction.guild.id
      ) ||
      // Search with giveaway ID
      client.giveawaysManager.giveaways.find(
        (g) => g.messageId === query && g.guildId === interaction.guild.id
      );

    // If no giveaway was found
    if (!giveaway) {
      return interaction.reply({
        content: ":x: Unable to find a giveaway for `" + query + "`.",
        ephemeral: true,
      });
    }

    if (giveaway.pauseOptions.isPaused) {
      return interaction.reply({
        content: `:x: **[This giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})**  is already paused.`,
        ephemeral: true,
      });
    }

    // Edit the giveaway
    client.giveawaysManager
      .pause(giveaway.messageId)
      // Success message
      .then(() => {
        // Success message
        interaction.reply(
          `:white_check_mark: **[This giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** has now been paused!`
        );
        if (logChannel) {
          logChannel.send(
            `**Giveaway paused!**\n>>> ${interaction.user.username} paused **[This giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})**!`
          );
        } else {
          return;
        }
      })
      .catch((e) => {
        interaction.reply({
          content: e,
          ephemeral: true,
        });
      });
  },
};
