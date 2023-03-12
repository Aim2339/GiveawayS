const { MessageEmbed } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  name: "ping",
  description: "🏓 Check my ping!",

  run: async (client, interaction) => {
    // Get the reference to the MongoDB database object
    const db = mongoose.connection.db;

    // Send a ping command to the MongoDB database and measure the response time
    const pingResult = await db.command({ ping: 1 });
    const mongoPing = pingResult.ok ? `${pingResult.ok}ms` : "unknown";

    const pembed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Client Ping")
      .addFields(
        {
          name: "**Latency**",
          value: `\`${Date.now() - interaction.createdTimestamp}ms\``,
        },
        {
          name: "**API Latency**",
          value: `\`${Math.round(client.ws.ping)}ms\``,
        },
        {
          name: "**MongoDB Latency**",
          value: `\`${mongoPing}\``,
        }
      )
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.username} | GiveawayS`,
        iconURL: interaction.user.displayAvatarURL(),
      });
    interaction.reply({
      embeds: [pembed],
    });
  },
};
