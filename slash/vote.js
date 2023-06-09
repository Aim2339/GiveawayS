const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: "vote",
  description: "🗳️ Vote for the bot!",

  run: async (client, interaction) => {
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel(`Vote for ${client.user.username}`)
        .setStyle("LINK")
        .setURL(`https://top.gg/bot/${client.user.id}/vote`)
    );
    let invite = new MessageEmbed()
      .setAuthor({ name: "Vote on Top.gg", iconURL: client.user.avatarURL() })
      .setTitle("Vote Link!")
      .setDescription(
        `Every vote counts, if you like ${client.user} then help us by voting!\nIf you really love us, then go ahead and post a nice review as well!`
      )
      .setColor("RANDOM")
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.username} | GiveawayS`,
        iconURL: interaction.user.displayAvatarURL(),
      });
    interaction.reply({ embeds: [invite], components: [row] });
  },
};
