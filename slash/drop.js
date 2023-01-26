const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const messages = require("../utils/message");
const ms = require("ms");
module.exports = {
  name: "drop",
  description: "🎉 Create a drop giveaway",

  options: [
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
    {
      name: "channel",
      description: "The channel to start the giveaway in",
      type: "CHANNEL",
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

    const giveawayChannel = interaction.options.getChannel("channel");
    const giveawayWinnerCount = interaction.options.getInteger("winners");
    const giveawayPrize = interaction.options.getString("prize");
    const logChannel = interaction.guild.channels.cache.find(
      (channel) => channel.name === "giveaway-log"
    );

    if (!giveawayChannel.isText()) {
      return interaction.reply({
        content: ":x: Please select a text channel!",
        ephemeral: true,
      });
    }
    if (giveawayWinnerCount < 1) {
      return interaction.reply({
        content:
          ":x: Please select a valid winner count! greater or equal to one.",
      });
    }

    let msg = await interaction.reply({
      content: `**Is everything correct?**\n>>> >>> - Channel: ${giveawayChannel}\n>>> - Winners: ${giveawayWinnerCount}\n>>> - Prize: ${giveawayPrize}`,
      ephemeral: false,
      fetchReply: true,
    });
    await msg.react("✅").then(() => msg.react("❌"));
    const filter = (reaction, user) => {
      return (
        ["✅", "❌"].includes(reaction.emoji.name) &&
        user.id === interaction.user.id
      );
    };

    msg
      .awaitReactions({ filter, max: 1, time: 65000, errors: ["time"] })
      .then((collected) => {
        const reaction = collected.first();

        if (reaction.emoji.name === "✅") {
          interaction.editReply(`Giveaway has started in ${giveawayChannel}`);
          client.giveawaysManager.start(giveawayChannel, {
            // The giveaway prize
            prize: giveawayPrize,
            // The giveaway winner count
            winnerCount: parseInt(giveawayWinnerCount),
            // The giveaway host
            hostedBy: client.config.hostedBy ? interaction.user : null,
            // Drop
            isDrop: true,

            messages,
          });
          msg.reactions.removeAll();

          if (logChannel) {
            logChannel.send(
              `**Giveaway started!**\n>>> ${interaction.user.username} started a giveaway of **${giveawayPrize}** in ${giveawayChannel}!`
            );
          } else {
            return;
          }
        } else {
          interaction.editReply(":x: Giveaway was cancelled");
          msg.reactions.removeAll();
        }
      })
      .catch((collected) => {
        interaction.editReply(
          ":x: You took time to reply, giveaway was canceled!"
        );
        msg.reactions.removeAll();
      });
  },
};
