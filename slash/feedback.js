const { MessageEmbed, MessageAttachment } = require("discord.js");
const config = require("../config.json");
const Sentiment = require("sentiment");

module.exports = {
  name: "feedback",
  description: "✍️ Send me feedback (can include bugs/issues)",

  options: [
    {
      name: "content",
      description: "What feedback to send",
      type: "STRING",
      required: true,
    },
    {
      name: "anonymous",
      description: "Send feedback anonymously (default: false)",
      type: "BOOLEAN",
      required: false,
    },
    {
      name: "screenshot",
      description: "Attach a screenshot",
      type: "ATTACHMENT",
      required: false,
    },
  ],

  run: async (client, interaction) => {
    const feedback = interaction.options.getString("content");
    const anonymous = interaction.options.getBoolean("anonymous") || false;
    const screenshot = interaction.options.getAttachment("screenshot") || null;
    // Check if feedback content is too long
    if (feedback.length > 500) {
      return interaction.reply({
        content: "Feedback content cannot be more than 500 characters.",
        ephemeral: true,
      });
    }

    // Check if screenshot is too big
    if (screenshot && screenshot.size > 5 * 1024 * 1024) {
      return interaction.reply({
        content: "Screenshot size cannot be more than 5 MB.",
        ephemeral: true,
      });
    }

    const sentiment = new Sentiment();
    const result = sentiment.analyze(feedback);

    const channel = client.channels.cache.get(config.feedbackChannelId);
    const fembed = new MessageEmbed()
      .setTitle(`Feedback sent`)
      .setColor("RANDOM")
      .setDescription("Your feedback has been sent to the Developer")
      .setImage(screenshot ? screenshot.url : null)
      .addFields(
        {
          name: "Content",
          value: `\`\`\`${feedback}\`\`\``,
        },
        {
          name: "Sentiment",
          value: `\`\`\`${
            result.score > 0 ? "👍" : result.score < 0 ? "👎" : "🤔"
          } ${result.comparative > 0 ? "+" : ""}${result.comparative.toFixed(
            2
          )} (${result.words.length} words)\`\`\``,
        }
      )
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.username} | GiveawayS`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    interaction.reply({ embeds: [fembed] });

    const aembed = new MessageEmbed()
      .setTitle(`New Feedback Received`)
      .setThumbnail(interaction.guild.iconURL())
      .setColor("RANDOM")
      .addFields(
        {
          name: "Content",
          value: `\`\`\`${feedback}\`\`\``,
        },
        {
          name: "Sent by",
          value: anonymous
            ? "`Anonymous`"
            : `\`\`\`${interaction.user.tag}\`\`\``,
        },
        {
          name: "Sentiment",
          value: `\`\`\`${
            result.score > 0 ? "👍" : result.score < 0 ? "👎" : "🤔"
          } ${result.comparative > 0 ? "+" : ""}${result.comparative.toFixed(
            2
          )} (${result.words.length} words)\`\`\``,
        }
      )
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.username} | GiveawayS`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    if (screenshot) {
      const attachment = new MessageAttachment(screenshot.url);
      aembed.setImage(`attachment://${screenshot.name}`);
      channel.send({ embeds: [aembed], files: [attachment] });
    } else {
      channel.send({ embeds: [aembed] });
    }
  },
};
