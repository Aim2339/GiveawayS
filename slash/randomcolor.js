const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "randomcolor",
  description: "Sends a random color's hex code",
  run: async (client, interaction) => {
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const hexembed = new MessageEmbed()
      .setColor(`#${randomColor}`)
      .setTitle("Here's a random color")
      .setDescription("The embed's color is your preview!\n")
      .addFields({
        name: "__Hex code:__",
        value: `#${randomColor}`,
        inline: true,
      })
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.username} | GiveawaySforLife`,
        iconURL: interaction.user.displayAvatarURL(),
      });
    interaction.reply({
      embeds: [hexembed],
    });
  },
};
