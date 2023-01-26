const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: "links",
  description: "Get a list of links related to the bot",
  run: async (client, interaction) => {
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("important")
        .setLabel("Important:")
        .setStyle("PRIMARY")
        .setDisabled(true),

      new MessageButton()
        .setLabel(`Invite Link`)
        .setStyle("LINK")
        .setURL(
          `https://discord.com/api/oauth2/authorize?client_id=900628889452314674&permissions=8&scope=applications.commands%20bot`
        ),

      new MessageButton()
        .setLabel(`Vote Link`)
        .setStyle("LINK")
        .setURL(`https://top.gg/bot/${client.user.id}/vote`)
    );
    const row2 = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("info")
        .setLabel("Info:")
        .setStyle("SUCCESS")
        .setDisabled(true),

      new MessageButton()
        .setLabel(`Status Link`)
        .setStyle("LINK")
        .setURL(`https://stats.uptimerobot.com/8gMWRsXP3N/`),

      new MessageButton()
        .setLabel(`Website Link`)
        .setStyle("LINK")
        .setURL(`https://aim2339.github.io/GiveawayS/`)
    );

    const row3 = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("other")
        .setLabel("Other:")
        .setStyle("DANGER")
        .setDisabled(true),

      new MessageButton()
        .setLabel(`Repository Link`)
        .setStyle("LINK")
        .setURL(`https://github.com/Aim2339/GiveawayS/`)
    );

    interaction.reply({
      content: "Here are all the links related to the bot!",
      components: [row, row2, row3],
    });
  },
};
