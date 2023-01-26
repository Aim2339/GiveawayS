const ms = require("ms");

module.exports = {
  name: "edit",
  description: "🎉 Edit a giveaway",

  options: [
    {
      name: "giveaway",
      description: "The giveaway to end (message ID)",
      type: "STRING",
      required: true,
    },
    {
      name: "duration",
      description:
        "Set the time of the mentioned giveaway. Add '-' before time to reduce it.",
      type: "STRING",
      required: true,
    },
    {
      name: "winners",
      description: "How many winners the giveaway should have",
      type: "INTEGER",
      required: true,
    },
    {
      name: "prize",
      description: "What the prize of the giveaway should be",
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
          ":x: You need to have the manage messages permissions to start giveaways.",
        ephemeral: true,
      });
    }
    const gid = interaction.options.getString("giveaway");
    const time = interaction.options.getString("duration");
    const newWinnerCount = interaction.options.getInteger("winners");
    const prize = interaction.options.getString("prize");

    let duration;
    if (time.startsWith("-")) {
      duration = -ms(time.substring(1));
    } else {
      duration = ms(time);
    }

    if (isNaN(duration)) {
      return interaction.reply({
        content: ":x: Please select a valid duration!",
        ephemeral: true,
      });
    }

    await interaction.deferReply({
      ephemeral: true,
    });
    // Edit the giveaway
    try {
      await client.giveawaysManager.edit(gid, {
        newWinnerCount: newWinnerCount,
        newPrize: prize,
        addTime: duration,
      });
    } catch (e) {
      return interaction.editReply({
        content: `:x: No giveaway found with the given message ID: \`${gid}\``,
        ephemeral: true,
      });
    }
    interaction.editReply({
      content: `:white_check_mark: This giveaway has now been edited!`,
      ephemeral: true,
    });
  },
};
