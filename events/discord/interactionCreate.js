const config = require("../../config.json");

module.exports = (client, interaction) => {
  if (interaction.isCommand()) {
    if (
      config.maintenanceMode &&
      interaction.user.id !== "756060979896385606"
    ) {
      return interaction.reply({
        content:
          "```yaml\nSorry, the bot is currently under maintenance. Please try again later within 15 minutes!```",
        ephemeral: true,
      });
    }

    const command = client.interactions.get(interaction.commandName);

    if (!command) {
      return interaction.reply({
        content:
          ":x: Something went wrong. Perhaps the command is not registered?",
        ephemeral: true,
      });
    }

    command.run(client, interaction);
  }
};
