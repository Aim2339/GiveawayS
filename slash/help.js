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
          "**Please Select a category to view all its commands**\nCurrently 19 commands are registered to the bot!"
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
            value: `Start a giveaway in your server!\n > **How?: \`/create\`**`,
            inline: true,
          },
          {
            name: "__Drop__",
            value: `Create a drop giveaway!\n > **How?: \`/drop\`**`,
            inline: true,
          },
          {
            name: "__Edit__",
            value: `Edit an already running giveaway!\n > **How?: \`/edit\`**`,
            inline: true,
          },
          {
            name: "__End__",
            value: `End an already running giveaway!\n > **How?: \`/end\`**`,
            inline: true,
          },
          {
            name: "__List__",
            value: `List all the giveaways running within this server!\n > **How?: \`/list\`**`,
            inline: true,
          },
          {
            name: "__Pause__",
            value: `Pause an already running giveaway!\n > **How?: \`/pause\`**`,
            inline: true,
          },
          {
            name: "__Reroll__",
            value: `Reroll an ended giveaway!\n > **How?: \`/reroll\`**`,
            inline: true,
          },
          {
            name: "__Resume__",
            value: `Resume a paused giveaway!\n > **How?: \`/resume\`**`,
            inline: true,
          },
          {
            name: "__Delete__",
            value: `Delete a ended giveaway!\n > **How?: \`/delete\`**`,
            inline: true,
          },
          {
            name: "__Log__",
            value: `Create a log channel for giveaway-logs!\n > **How?: \`/log\`**`,
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
            value: `Shows all available commands to this bot!\n > **How?: \`/help\`**`,
            inline: true,
          },
          {
            name: "__Invite__",
            value: `Get the bot's invite link!\n > **How?: \`/invite\`**`,
            inline: true,
          },
          {
            name: "__Ping__",
            value: `Check the bot's websocket latency!\n > **How?: \`/ping\`**`,
            inline: true,
          },
          {
            name: "__Vote__",
            value: `Vote for the bot!\n > **How?: \`/vote\`**`,
            inline: true,
          },
          {
            name: "__Feedback__",
            value: `Send live feedback about the bot to the developer!\n > **How?: \`/feedback\`**`,
            inline: true,
          },
          {
            name: "__Status__",
            value: `Check the bot's status!\n > **How?: \`/status\`**`,
            inline: true,
          },
          {
            name: "__Stats__",
            value: `Check the bot's physical statistics!\n > **How?: \`/stats\`**`,
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
            value: `Play rock paper scissors with the bot!\n > **How?: \`/rps\`**`,
            inline: true,
          },
          {
            name: "__Randomcolor__",
            value: `Get a random color with its hex code!\n > **How?: \`/randomcolor\`**`,
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
  