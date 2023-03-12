const os = require("os");
const { MessageEmbed } = require("discord.js");
const feroms = require("fero-ms");
const mongoose = require("mongoose");

module.exports = {
  name: "stats",
  description: "📊 Sends bot physical statistics",

  run: async (client, interaction) => {
    const uptime = client.uptime;
    const shortUptime = feroms.ms(uptime);
    const model = os.cpus()[0].model;
    const cores = os.cpus().length;
    const platform = os.platform();
    const nodejs = process.version;
    const djs = require("discord.js").version;
    const botversion = require("../package.json").version;
    const server = client.guilds.cache.size;
    const user =
      client.guilds.cache.reduce((a, g) => a + g.memberCount, 0) -
      client.guilds.cache.size;
    const channel = client.channels.cache.size;
    const developer = require("../package.json").author;
    let dbStatus;
    if (mongoose.connection.readyState === 1) {
      dbStatus = "MongoDB: Connected";
    } else {
      dbStatus = "MongoDB: Not Connected";
    }

    const statsembed = new MessageEmbed()
      .addFields(
        {
          name: "I have been online for?",
          value: `\`\`\`${shortUptime}\`\`\``,
        },
        {
          name: "Guilds",
          value: `\`${server}\``,
          inline: true,
        },
        {
          name: "Users",
          value: `\`${user}\``,
          inline: true,
        },
        {
          name: "Channels",
          value: `\`${channel}\``,
          inline: true,
        },
        {
          name: "Bot Version",
          value: `\`v${botversion}\``,
          inline: true,
        },
        {
          name: "Database",
          value: `\`${dbStatus}\``,
          inline: true,
        },
        {
          name: "Arch",
          value: `\`${os.arch()}\``,
          inline: true,
        },
        {
          name: "Platform",
          value: `\`${platform}\``,
          inline: true,
        },
        {
          name: "Cores",
          value: `\`${cores}\``,
          inline: true,
        },
        {
          name: "Discord.js Version",
          value: `\`v${djs}\``,
          inline: true,
        },
        {
          name: "Node.js Version",
          value: `\`${nodejs}\``,
          inline: true,
        },
        {
          name: "Ram Usage",
          value: `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
            2
          )}MB/ ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB\``,
          inline: true,
        },
        {
          name: "Developer",
          value: `\`${developer}\``,
          inline: true,
        },
        {
          name: "CPU Model",
          value: `\`\`\`${model}\`\`\``,
        }
      )
      .setColor("RANDOM")
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.username} | GiveawayS`,
        iconURL: interaction.user.displayAvatarURL(),
      });
    interaction.reply({ embeds: [statsembed] });
  },
};
