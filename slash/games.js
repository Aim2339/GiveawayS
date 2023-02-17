const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "games",
  description: "Play games with the bot",
  options: [
    {
      name: "game",
      description: "Choose a game to play",
      type: "STRING",
      required: true,
      choices: [
        { name: "Snake", value: "snake" },
        { name: "Rock Paper Scissors", value: "rps" },
        { name: "Minesweeper", value: "minesweeper" },
        { name: "Match Pairs", value: "matchpairs" },
      ],
    },
  ],
  run: async (client, interaction) => {
    const game = interaction.options.getString("game");

    if (game === "snake") {
      const snake = require("../games/snake.js");
      return snake.run(client, interaction);
    } else if (game === "rps") {
      const rps = require("../games/rps.js");
      return rps.run(client, interaction);
    } else if (game === "minesweeper") {
      const minesweeper = require("../games/minesweeper.js");
      return minesweeper.run(client, interaction);
    } else if (game === "matchpairs") {
      const matchpairs = require("../games/matchpairs.js");
      return matchpairs.run(client, interaction);
    } else {
      const embed = new MessageEmbed()
        .setColor("RED")
        .setDescription("Invalid game selected. Please try again.");
      return interaction.reply({ embeds: [embed] });
    }
  },
};
