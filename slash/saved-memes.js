const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const mongoose = require("mongoose");

const SavedMeme = require("../schema/savedMeme");

module.exports = {
  name: "saved-memes",
  description: "📚 Shows your saved memes",

  run: async (client, interaction) => {
    const userId = interaction.user.id;

    // Find saved memes for the user
    const savedMemes = await SavedMeme.find({ userId });

    if (savedMemes.length === 0) {
      return interaction.reply("You have no saved memes.");
    }

    const embeds = savedMemes.map((meme) => {
      return new MessageEmbed()
        .setTitle(meme.title)
        .setURL(meme.postLink)
        .setImage(meme.image)
        .setFooter({
          text: `👍 ${meme.upvotes}`,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setColor("RANDOM");
    });

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("previous")
        .setEmoji("⬅️")
        .setStyle("PRIMARY")
        .setDisabled(true),
      new MessageButton()
        .setCustomId("next")
        .setEmoji("➡️")
        .setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId("delete")
        .setStyle("DANGER")
        .setEmoji("🗑️")
    );

    let currentIndex = 0;

    const message = await interaction.reply({
      embeds: [embeds[currentIndex]],
      components: [row],
      fetchReply: true,
    });

    const filter = (interaction) => interaction.user.id === userId;
    const collector = message.createMessageComponentCollector({
      filter,
      time: 30000, // Time in milliseconds for how long the collector should be active
    });

    collector.on("collect", async (interaction) => {
      if (interaction.customId === "previous") {
        currentIndex--;
        if (currentIndex === 0) {
          row.components[0].setDisabled(true);
        }
        row.components[1].setDisabled(false);
      } else if (interaction.customId === "next") {
        currentIndex++;
        if (currentIndex === embeds.length - 1) {
          row.components[1].setDisabled(true);
        }
        row.components[0].setDisabled(false);
      } else if (interaction.customId === "delete") {
        const deletedMeme = savedMemes[currentIndex];
        await SavedMeme.deleteOne({ _id: deletedMeme._id });
        savedMemes.splice(currentIndex, 1);
        embeds.splice(currentIndex, 1);

        if (embeds.length === 0) {
          interaction.update("Meme deleted. You have no saved memes left.");
          collector.stop();
          return;
        }

        if (currentIndex >= embeds.length) {
          currentIndex = embeds.length - 1;
        }

        row.components[0].setDisabled(currentIndex === 0);
        row.components[1].setDisabled(currentIndex === embeds.length - 1);
      }

      await interaction.update({
        embeds: [embeds[currentIndex]],
        components: [row],
      });
    });

    collector.on("end", () => {
      row.components.forEach((component) => {
        component.setDisabled(true);
      });
      message.edit({
        components: [row],
      });
    });
  },
};
