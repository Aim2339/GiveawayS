const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
  name: "log",
  description: "🪵 Set up a log channel",

  run: async (client, interaction) => {
    if (
      !interaction.member.permissions.has("MANAGE_MESSAGES") &&
      !interaction.member.roles.cache.some((r) => r.name === "Giveaways")
    ) {
      return interaction.reply({
        content:
          ":x: You need to have the manage messages permission or be in the Giveaways role to set up a log channel.",
        ephemeral: true,
      });
    }

    const embed = new MessageEmbed()
      .setTitle("Choose channel visibility")
      .setDescription(
        "Would you like the log channel to be visible to everyone or only to people having permission to create giveaways?"
      )
      .setColor("RANDOM");

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("public")
          .setLabel("Public")
          .setStyle("PRIMARY")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("private")
          .setLabel("Private")
          .setStyle("PRIMARY")
      );

    const message = await interaction.reply({
      embeds: [embed],
      components: [row],
      fetchReply: true,
      ephemeral: true,
    });

    const filter = (i) => i.user.id === interaction.user.id;

    const collector = message.createMessageComponentCollector({
      filter,
      max: 1,
      time: 60000,
      errors: ["time"],
    });

    collector.on("collect", async (i) => {
      if (i.customId === "public" || i.customId === "private") {
        const isPrivate = i.customId === "private";
        await i.deferUpdate();
        await interaction.followUp({
          content: `Channel will be set to ${
            isPrivate ? "private" : "public"
          }.\n1. Please don't edit the name of the channel else it won't work!\n2. If you want to stop the giveaway log in that channel then edit the name or manually delete it!\n3. If 2 channels were made delete the one where a message hasn't been sent by the bot!`,
          ephemeral: true,
        });

        const overwrites = [
          {
            id: interaction.guild.roles.everyone,
            allow: ["READ_MESSAGE_HISTORY"],
            deny: [
              "SEND_MESSAGES",
              "ADD_REACTIONS",
              isPrivate ? "VIEW_CHANNEL" : "",
            ],
          },
          {
            id: client.user.id,
            allow: ["SEND_MESSAGES"],
          },
        ];

        const logChannel = await interaction.guild.channels.create(
          "giveaway-log",
          {
            type: "text",
            permissionOverwrites: overwrites,
          }
        );

        await logChannel.send(
          `**This channel has been set up by ${interaction.user} for receiving giveaway logs!**`
        );

        collector.stop();
      }
    });

    collector.on("end", async () => {
      try {
        await interaction.editReply({
          content: `Done`,
          components: [],
        });
      } catch (error) {
        console.error(error);
      }
    });
  },
};
