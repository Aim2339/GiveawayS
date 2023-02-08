const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");

module.exports = {
  name: "help",
  description: "📜 View all the commands available to the bot!",
  run: async (client, interaction) => {
    const embed = new MessageEmbed()
      .setTitle(`Commands of ${client.user.username}`)
      .setColor("RANDOM")
      .setDescription(
        "**Please Select a category to view all its commands**\nCurrently 20 commands are registered to the bot!"
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.username} | GiveawaySforLife`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    const giveaway = new MessageEmbed()
      .setTitle("Categories » Giveaway")
      .setColor("RANDOM")
      .setDescription("```yaml\nHere are the giveaway commands:```")
      .addFields(
        {
          name: "__Create__",
          value: `Start a giveaway in your server!\n > **Command: \`/create\`**`,
          inline: true,
        },
        {
          name: "__Drop__",
          value: `Create a drop giveaway!\n > **Command: \`/drop\`**`,
          inline: true,
        },
        {
          name: "__Edit__",
          value: `Edit an already running giveaway!\n > **Command: \`/edit\`**`,
          inline: true,
        },
        {
          name: "__End__",
          value: `End an already running giveaway!\n > **Command: \`/end\`**`,
          inline: true,
        },
        {
          name: "__List__",
          value: `List all the giveaways running within this server!\n > **Command: \`/list\`**`,
          inline: true,
        },
        {
          name: "__Pause__",
          value: `Pause an already running giveaway!\n > **Command: \`/pause\`**`,
          inline: true,
        },
        {
          name: "__Reroll__",
          value: `Reroll an ended giveaway!\n > **Command: \`/reroll\`**`,
          inline: true,
        },
        {
          name: "__Resume__",
          value: `Resume a paused giveaway!\n > **Command: \`/resume\`**`,
          inline: true,
        },
        {
          name: "__Delete__",
          value: `Delete a ended giveaway!\n > **Command: \`/delete\`**`,
          inline: true,
        },
        {
          name: "__Log__",
          value: `Create a log channel for giveaway-logs!\n > **Command: \`/log\`**`,
        }
      )
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.username} | GiveawaySforLife`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    const general = new MessageEmbed()
      .setTitle("Categories » General")
      .setColor("RANDOM")
      .setDescription("```yaml\nHere are the general bot commands:```")
      .addFields(
        {
          name: "__Help__",
          value: `Shows all available commands to this bot!\n > **Command: \`/help\`**`,
          inline: true,
        },
        {
          name: "__Invite__",
          value: `Get the bot's invite link!\n > **Command: \`/invite\`**`,
          inline: true,
        },
        {
          name: "__Ping__",
          value: `Check the bot's websocket latency!\n > **Command: \`/ping\`**`,
          inline: true,
        },
        {
          name: "__Vote__",
          value: `Vote for the bot!\n > **Command: \`/vote\`**`,
          inline: true,
        },
        {
          name: "__Feedback__",
          value: `Send live feedback about the bot to the developer!\n > **Command: \`/feedback\`**`,
          inline: true,
        },
        {
          name: "__Status__",
          value: `Check the bot's status!\n > **Command: \`/status\`**`,
          inline: true,
        },
        {
          name: "__Stats__",
          value: `Check the bot's physical statistics!\n > **Command: \`/stats\`**`,
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.username} | GiveawaySforLife`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    const fun = new MessageEmbed()
      .setTitle("Categories » Fun")
      .setColor("RANDOM")
      .setDescription("```yaml\nHere are the fun based commands:```")
      .addFields(
        {
          name: "__Rps__",
          value: `Play rock paper scissors with the bot!\n > **Command: \`/rps\`**`,
          inline: true,
        },
        {
          name: "__Randomcolor__",
          value: `Get a random color with its hex code!\n > **Command: \`/randomcolor\`**`,
          inline: true,
        },
        {
          name: "__Akinator__",
          value: `Play a game with akinator!\n > **Command: \`/akinator\`**`,
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.username} | GiveawaySforLife`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    const components = (state) => [
      new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("help-menu")
          .setPlaceholder("Please Select a Category to get Started!")
          .setDisabled(state)
          .addOptions([
            {
              label: `Giveaways`,
              value: `giveaway`,
              description: `View all the giveaway based commands!`,
              emoji: `🎉`,
            },
            {
              label: `General`,
              value: `general`,
              description: `View all the general bot commands!`,
              emoji: `⚙`,
            },
            {
              label: `Fun`,
              value: `fun`,
              description: `View all the fun based commands!`,
              emoji: `😂`,
            },
          ])
      ),
    ];

    const initialMessage = await interaction.reply({
      embeds: [embed],
      components: components(false),
    });

    const filter = (interaction) =>
      interaction.user.id === interaction.member.id;

    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      componentType: "SELECT_MENU",
      idle: 500000,
      dispose: true,
    });

    collector.on("collect", (interaction) => {
      if (interaction.values[0] === "giveaway") {
        interaction
          .update({ embeds: [giveaway], components: components(false) })
          .catch((e) => {});
      } else if (interaction.values[0] === "general") {
        interaction
          .update({ embeds: [general], components: components(false) })
          .catch((e) => {});
      } else if (interaction.values[0] === "fun") {
        interaction
          .update({ embeds: [fun], components: components(false) })
          .catch((e) => {});
      }
    });
    collector.on("end", (collected, reason) => {
      if (reason == "time") {
        interaction.editReply({
          content: "Collector Destroyed, Try Again!",
          components: [],
        });
      }
    });
  },
};
