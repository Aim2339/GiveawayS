const mongoose = require("mongoose");
const giveawayBan = require("../schema/giveawayBan");

module.exports = {
  name: "ban-unban",
  description:
    "🚫 Ban or unban a user from participating in giveaways in this guild",
  options: [
    {
      name: "user",
      description: "The user to ban or unban",
      type: "USER",
      required: true,
    },
    {
      name: "action",
      description: "The action to perform (ban or unban)",
      type: "STRING",
      required: true,
      choices: [
        {
          name: "Ban",
          value: "ban",
        },
        {
          name: "Unban",
          value: "unban",
        },
      ],
    },
  ],
  run: async (client, interaction) => {
    // If the member doesn't have enough permissions
    if (
      !interaction.member.permissions.has("MANAGE_GUILD") &&
      !interaction.member.roles.cache.some((r) => r.name === "Giveaways")
    ) {
      return interaction.reply({
        content:
          ":x: You need to have the manage server permissions to start giveaways.",
        ephemeral: true,
      });
    }

    if (interaction.options.getUser("user").bot) {
      return interaction.reply({
        content: ":x: Bots cannot be banned",
        ephemeral: true,
      });
    }

    const userId = interaction.options.getUser("user").id;
    const guildId = interaction.guild.id;
    const action = interaction.options.getString("action");

    let user;
    if (action === "ban") {
      user = await giveawayBan.findOne({ userId, guildId });
      if (user) {
        return interaction.reply({
          content:
            "This user is already banned from participating in giveaways in this guild.",
          ephemeral: true,
        });
      }
      await giveawayBan.create({ userId, guildId });
      interaction.reply({
        content: `User <@${userId}> has been banned from participating in giveaways in this guild.`,
        ephemeral: false,
      });
    } else if (action === "unban") {
      user = await giveawayBan.findOne({ userId, guildId });
      if (!user) {
        return interaction.reply({
          content:
            "This user is not currently banned from participating in giveaways in this guild.",
          ephemeral: true,
        });
      }
      await giveawayBan.findOneAndDelete({ userId, guildId });
      interaction.reply({
        content: `User <@${userId}> has been unbanned from participating in giveaways in this guild.`,
        ephemeral: false,
      });
    } else {
      interaction.reply({
        content:
          'Invalid action provided. Please provide either "ban" or "unban".',
        ephemeral: true,
      });
    }
  },
};
