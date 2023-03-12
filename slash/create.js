const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const messages = require("../utils/message");
const ms = require("ms");
const client = require("../index");
const MessageCount = require("../schema/messageCount");

module.exports = {
  name: "create",
  description: "🎉 Create a giveaway",

  options: [
    {
      name: "duration",
      description:
        "How long the giveaway should last for. Example values: 1m, 1h, 1d",
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
    {
      name: "channel",
      description: "The channel to start the giveaway in",
      type: "CHANNEL",
      required: true,
    },
    {
      name: "activebonus",
      description: "Give users a bonus chance based on their message count",
      type: "BOOLEAN",
      required: false,
      default: false,
    },
    {
      name: "pingrole",
      description: "The role to ping when starting the giveaway",
      type: "ROLE",
      required: false,
    },
    {
      name: "bonusrole",
      description: "Role which would recieve bonus entries",
      type: "ROLE",
      required: false,
    },
    {
      name: "bonusamount",
      description: "The amount of bonus entries the role will recieve",
      type: "INTEGER",
      required: false,
    },
    {
      name: "reqrole",
      description: "Role you want to add as giveaway joining requirement",
      type: "ROLE",
      required: false,
    },
    {
      name: "thumbnail",
      description: "Img/gif you want to add to the giveaway",
      type: "STRING",
      required: false,
    },
    {
      name: "note",
      description:
        "Anything you wanna type (can include requirements/how to claim)",
      type: "STRING",
      required: false,
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
    const giveawayDuration = interaction.options.getString("duration");
    const giveawayWinnerCount = interaction.options.getInteger("winners");
    const giveawayPrize = interaction.options.getString("prize");
    const giveawayPing = interaction.options.getRole("pingrole");
    const bonusRole = interaction.options.getRole("bonusrole");
    const bonusEntries = interaction.options.getInteger("bonusamount");
    const giveawayNote = interaction.options.getString("note");
    const thumbnail = interaction.options.getString("thumbnail");
    const rolereq = interaction.options.getRole("reqrole");
    const logChannel = interaction.guild.channels.cache.find(
      (channel) => channel.name === "giveaway-log"
    );

    if (!giveawayChannel.isText()) {
      return interaction.reply({
        content: ":x: Please select a text channel!",
        ephemeral: true,
      });
    }
    if (isNaN(ms(giveawayDuration))) {
      return interaction.reply({
        content: ":x: Please select a valid duration!",
        ephemeral: true,
      });
    }
    if (giveawayWinnerCount < 1) {
      return interaction.reply({
        content:
          ":x: Please select a valid winner count! greater or equal to one.",
      });
    }
    if (thumbnail) {
      const pattern = /^https?:\/\/[\w-]+\.(jpg|png|jpeg|gif)$/i;

      if (pattern.test(thumbnail)) {
        console.log(thumbnail);
      } else {
        interaction.reply({
          content: `:x: Invalid image file!\nPlease attach a JPEG, PNG, or GIF file with a valid URL that starts with "http://" or "https://"!`,
          ephemeral: true,
        });
      }
    }

    if (bonusRole) {
      if (!bonusEntries) {
        return interaction.reply({
          content: `:x: You must specify how many bonus entries would ${bonusRole} recieve!`,
          ephemeral: true,
        });
      }
    }

    if (bonusRole && rolereq && interaction.options.getBoolean("activebonus")) {
      messages.inviteToParticipate = `**React with 🎉 to participate!**\n>>> **${bonusRole}** Has **${bonusEntries}** Extra Entries in this giveaway!\nOnly members having ${rolereq} are allowed to participate in this giveaway!\nThis giveaway includes active bonus entries based on your message count!`;
    }
    if (
      bonusRole &&
      rolereq &&
      !interaction.options.getBoolean("activebonus")
    ) {
      messages.inviteToParticipate = `**React with 🎉 to participate!**\n>>> **${bonusRole}** Has **${bonusEntries}** Extra Entries in this giveaway!\nOnly members having ${rolereq} are allowed to participate in this giveaway!`;
    }
    if (
      !bonusRole &&
      rolereq &&
      interaction.options.getBoolean("activebonus")
    ) {
      messages.inviteToParticipate = `**React with 🎉 to participate!**\n>>> Only members having ${rolereq} are allowed to participate in this giveaway!\nThis giveaway includes active bonus entries based on your message count!`;
    }
    if (
      !bonusRole &&
      rolereq &&
      !interaction.options.getBoolean("activebonus")
    ) {
      messages.inviteToParticipate = `**React with 🎉 to participate!**\n>>> Only members having ${rolereq} are allowed to participate in this giveaway!`;
    }
    if (
      bonusRole &&
      !rolereq &&
      interaction.options.getBoolean("activebonus")
    ) {
      messages.inviteToParticipate = `**React with 🎉 to participate!**\n>>> **${bonusRole}** Has **${bonusEntries}** Extra Entries in this giveaway!\nThis giveaway includes active bonus entries based on your message count!`;
    }
    if (
      bonusRole &&
      !rolereq &&
      !interaction.options.getBoolean("activebonus")
    ) {
      messages.inviteToParticipate = `**React with 🎉 to participate!**\n>>> **${bonusRole}** Has **${bonusEntries}** Extra Entries in this giveaway!`;
    }
    if (
      !bonusRole &&
      !rolereq &&
      interaction.options.getBoolean("activebonus")
    ) {
      messages.inviteToParticipate = `**React with 🎉 to participate!**\n>>> This giveaway includes active bonus entries based on your message count!`;
    }
    if (
      !bonusRole &&
      !rolereq &&
      !interaction.options.getBoolean("activebonus")
    ) {
      messages.inviteToParticipate = `**React with 🎉 to participate!**`;
    }

    const nembed = new MessageEmbed()
      .setTitle("Note from the host")
      .setColor("RANDOM")
      .setTimestamp()
      .addFields({
        name: `Note from ${interaction.user.username}!`,
        value: `>>> ${giveawayNote}`,
      })
      .setFooter({
        text: `Note from ${interaction.user.username} | GiveawayS`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    let msg = await interaction.reply({
      content: `**Is everything correct?**\n>>> >>> - Channel: ${giveawayChannel}\n>>> - Duration: ${giveawayDuration}\n>>> - Winners: ${giveawayWinnerCount}\n>>> - Prize: ${giveawayPrize}\n>>> - Active bonus: ${interaction.options.getBoolean(
        "activebonus"
      )}\n>>> - Role to ping: ${giveawayPing}\n>>> - Bonus role: ${bonusRole}\n>>> - Bonus amount: ${bonusEntries}\n>>> - Requirement role: ${rolereq}\n>>> - Thumbnail: ${thumbnail}\n>>> - Note: ${giveawayNote}`,
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
      .awaitReactions({ filter, max: 1, time: 60000, errors: ["time"] })
      .then((collected) => {
        const reaction = collected.first();

        if (reaction.emoji.name === "✅") {
          interaction.editReply(`Giveaway has started in ${giveawayChannel}`);
          client.giveawaysManager.start(giveawayChannel, {
            // The giveaway duration
            duration: ms(giveawayDuration),
            // The giveaway prize
            prize: giveawayPrize,
            // The giveaway winner count
            winnerCount: parseInt(giveawayWinnerCount),
            // The giveaway host
            hostedBy: client.config.hostedBy ? interaction.user : null,
            // Thumbnail if provided
            thumbnail: thumbnail,
            // BonusEntries If Provided
            bonusEntries: [
              {
                bonus: new Function(
                  "member",
                  `return member.roles.cache.some((r) => r.name === '${bonusRole?.name}') ? ${bonusEntries} : null`
                ),
                cumulative: false,
              },
              {
                // Add the activeBonus function as a bonus entry
                bonus: async (member) => {
                  // Retrieve the message count for the user
                  const messageCountDoc = await MessageCount.findOne({
                    userId: interaction.user.id,
                    guildId: interaction.guild.id,
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

                  // Return the active bonus percentage as the bonus entry value
                  return activeBonus;
                },
                cumulative: false,
              },
            ],
            messages,
            extraData: {
              role: rolereq == null ? "null" : rolereq.id,
              activeBonus:
                interaction.options.getBoolean("activebonus") || false, // include the activeBonus option
            },
          });

          msg.reactions.removeAll();

          if (logChannel) {
            logChannel.send(
              `**Giveaway started!**\n>>> ${interaction.user.username} started a giveaway of **${giveawayPrize}** in ${giveawayChannel}!`
            );
          } else {
            return;
          }

          if (giveawayNote && giveawayPing) {
            giveawayChannel.send({ embeds: [nembed] });
            giveawayChannel.send(`${giveawayPing}`);
          }
          if (giveawayNote && !giveawayPing) {
            giveawayChannel.send({ embeds: [nembed] });
          }
          if (!giveawayNote && giveawayPing) {
            giveawayChannel.send(`${giveawayPing}`);
          }
          if (!giveawayNote && !giveawayPing) {
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
