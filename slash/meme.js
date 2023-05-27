const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const fetch = require("reddit-image-fetcher");

const SavedMeme = require("../schema/savedMeme");

module.exports = {
  name: "meme",
  description: "🐸 Fetches a random meme from r/memes",

  run: async (client, interaction) => {
    const embed = new MessageEmbed()
      .setTitle("Loading 50 memes...")
      .setColor("RANDOM");

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("prev")
        .setStyle("SECONDARY")
        .setEmoji("⬅️"),
      new MessageButton()
        .setCustomId("next")
        .setStyle("SECONDARY")
        .setEmoji("➡️"),
      new MessageButton().setCustomId("like").setStyle("SUCCESS").setEmoji("❤️")
    );

    const message = await interaction.reply({
      embeds: [embed],
      components: [row],
      fetchReply: true,
    });

    let memes = [];

    try {
      memes = await fetch.fetch({
        type: "meme",
        total: 50,
        subreddit: "memes",
        removeNSFW: true,
        imageType: ["png", "jpg", "jpeg"],
      });
    } catch (error) {
      console.error(error);
      return interaction.editReply({
        content: "Failed to fetch memes.",
        components: [],
      });
    }

    let index = 0;
    const meme = memes[index];
    embed
      .setTitle(meme.title)
      .setURL(meme.postLink)
      .setImage(meme.image)
      .setFooter({
        text: `👍 ${meme.upvotes}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setColor("RANDOM");
    await message.edit({ embeds: [embed] });

    const filter = (i) => i.user.id === interaction.user.id;

    const collector = message.createMessageComponentCollector({
      filter,
      time: 300000,
    });

    collector.on("collect", async (i) => {
      await i.deferUpdate();

      if (i.customId === "prev") {
        index = (index - 1 + memes.length) % memes.length;
      } else if (i.customId === "next") {
        index = (index + 1) % memes.length;
      } else if (i.customId === "like") {
        const memeToSave = memes[index];

        const existingMeme = await SavedMeme.findOne({
          postLink: memeToSave.postLink,
          userId: interaction.user.id,
        });

        if (existingMeme) {
          return interaction.followUp({
            content:
              "You have already saved this meme! Try `/saved-memes` to see your saved memes.",
            ephemeral: true,
          });
        }

        const savedMeme = new SavedMeme({
          title: memeToSave.title,
          postLink: memeToSave.postLink,
          image: memeToSave.image,
          upvotes: memeToSave.upvotes,
          userId: interaction.user.id,
        });

        await savedMeme.save();
        return interaction.followUp({
          content:
            "Meme saved successfully! Try `/saved-memes` to see your saved memes.",
          ephemeral: true,
        });
      }

      const meme = memes[index];
      embed
        .setTitle(meme.title)
        .setURL(meme.postLink)
        .setImage(meme.image)
        .setFooter({
          text: `👍 ${meme.upvotes}`,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setColor("RANDOM");
      await message.edit({ embeds: [embed] });
    });

    collector.on("end", async () => {
      row.components.forEach((c) => c.setDisabled(true));
      await message.edit({ components: [row] });
    });
  },
};
