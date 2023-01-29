module.exports = {
  name: "resume",
  description: "▶ Resume a paused giveaway",

  options: [
    {
      name: "giveaway",
      description: "The giveaway to resume (message ID or giveaway prize)",
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

    if (!giveaway.pauseOptions.isPaused) {
      return interaction.reply({
        content: `:x: **[This giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})**  is not paused!`,
        ephemeral: true,
      });
    }

    // Edit the giveaway
    client.giveawaysManager
      .unpause(giveaway.messageId)
      // Success message
      .then(() => {
        // Success message
        interaction.reply(
          `:white_check_mark: **[This giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** has been successfully resumed!`
        );
        if (logChannel) {
          logChannel.send(
            `**Giveaway resumed!**\n>>> ${interaction.user.username} resumed **[This giveaway](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})**!`
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
