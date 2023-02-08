const akinator = require("discord.js-akinator");

module.exports = {
  name: "akinator",
  description: "🎉 Play a game with akinator",

  options: [
    {
      name: "theme",
      description: "What you want the game type to be",
      type: "STRING",
      required: true,
      choices: [
        { name: "Character", value: "character" },
        { name: "Animal", value: "animal" },
        { name: "Object", value: "object" },
      ],
    },
  ],

  run: async (client, interaction) => {
    const theme = interaction.options.getString("theme");

    akinator(interaction, {
      childMode: interaction.channel.nsfw ? false : true, // Defaults to "false"
      gameType: `${theme}`, // Defaults to "character"
      useButtons: true, // Defaults to "false"
    });
  },
};
