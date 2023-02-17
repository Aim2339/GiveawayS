const { Snake } = require("discord-gamecord");

module.exports = {
  name: "snake",
  description: "Play snake game with the bot",

  run: async (client, interaction) => {
    const Game = new Snake({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: "Snake Game 🐍",
        overTitle: `Game Over 💀\nWhy don't you try again!`,
        color: "RANDOM",
      },
      emojis: {
        board: "⬛",
        food: "🍎",
        up: "⬆️",
        down: "⬇️",
        left: "⬅️",
        right: "➡️",
      },
      snake: { head: "🟢", body: "🟩", tail: "🟢", over: "💀" },
      foods: ["🍎", "🍇", "🍊", "🫐", "🥕", "🥝", "🌽"],
      stopButton: "Stop",
      timeoutTime: 60000,
      playerOnlyMessage: "Only {player} can use these buttons.",
    });

    Game.startGame();
  },
};
