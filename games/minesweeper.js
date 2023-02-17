const { Minesweeper } = require("discord-gamecord");

module.exports = {
  name: "minesweeper",
  description: "Play minesweeper with the bot",

  run: async (client, interaction) => {
    const Game = new Minesweeper({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: "Minesweeper",
        color: "RANDOM",
        description: "Click on the buttons to reveal the blocks except mines.",
      },
      emojis: { flag: "🚩", mine: "💣" },
      mines: 5,
      timeoutTime: 60000,
      winMessage: "You won the Game! You successfully avoided all the mines.",
      loseMessage: "You lost the Game! Beaware of the mines next time.",
      playerOnlyMessage: "Only {player} can use these buttons.",
    });

    Game.startGame();
  },
};
