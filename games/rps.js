const Discord = require("discord.js");

module.exports = {
  name: "rps",
  description: "Play rock paper scissors with the bot",

  run: async (client, interaction) => {
    const hand = [
      { txt: "Rock", emoji: "✊", index: 0 },
      { txt: "Paper", emoji: "🤚", index: 1 },
      { txt: "Scissors", emoji: "✌️", index: 2 },
    ];
    const botMove = hand[Math.floor(Math.random() * 3)];

    await interaction.reply({
      embeds: [
        new Discord.MessageEmbed()
          .setColor("RANDOM")
          .setTitle("Rock Paper Scissors")
          .setDescription("Choose a handsign")
          .setFooter({
            text: `Requested by ${interaction.user.username} | GiveawaySforLife`,
            iconURL: interaction.user.displayAvatarURL(),
          }),
      ],
      components: [
        new Discord.MessageActionRow().addComponents(
          new Discord.MessageButton()
            .setCustomId(`rps_rock`)
            .setLabel("✊ Rock")
            .setStyle("PRIMARY"),
          new Discord.MessageButton()
            .setCustomId(`rps_paper`)
            .setLabel("🤚 Paper")
            .setStyle("PRIMARY"),
          new Discord.MessageButton()
            .setCustomId(`rps_scissors`)
            .setLabel("✌️ Scissors")
            .setStyle("PRIMARY")
        ),
      ],
    });

    let win = 0;
    let userMove;

    const f = async (interaction2) => {
      const rpsMsg = interaction2.message;
      if (!interaction2.isButton()) return;
      if (interaction2.customId.startsWith("rps")) {
        await interaction2.deferUpdate();
        let move = interaction2.customId.split("_")[1];
        userMove = hand.find((v) => v.txt.toLowerCase() == move);
        switch (move) {
          case "rock":
            win = botMove.index == 0 ? 1 : botMove.index == 1 ? 0 : 2;
            break;
          case "paper":
            win = botMove.index == 0 ? 2 : botMove.index == 1 ? 1 : 0;
            break;
          case "scissors":
            win = botMove.index == 0 ? 0 : botMove.index == 1 ? 2 : 1;
            break;
        }

        const embed = rpsMsg.embeds[0];

        embed.description = `I chose ${botMove.txt}! ${
          win == 0 ? "You lost!" : win == 1 ? "We tied!" : "You win!"
        } (${userMove.emoji} ${win == 0 ? "<" : win == 1 ? "=" : ">"} ${
          botMove.emoji
        })`;

        const components = rpsMsg.components;

        components[0].components.forEach((comp) => {
          if (comp.customId == interaction2.customId) {
            comp.disabled = true;
            comp.style = "SECONDARY";
          } else comp.disabled = true;
        });

        interaction2.message.edit({ embeds: [embed], components: components });

        client.off("interactionCreate", f);
      }
    };

    client.on("interactionCreate", f);
  },
};
