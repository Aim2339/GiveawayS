const Discord = require("discord.js");
module.exports = {
  async execute(giveaway, member) {
    return member
      .send({
        embeds: [
          new Discord.MessageEmbed()
            .setTimestamp()
            .setTitle(
              "❓ Hold Up Did You Just Remove a Reaction From A Giveaway?"
            )
            .setColor("RANDOM")
            .setDescription(
              `Your entry to **[[This Giveaway]](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** was recorded but you un-reacted, since you don't need **${giveaway.prize}** I will have to choose someone else now!😭`
            )
            .setTimestamp()
            .setFooter({
              text: `Think It was a mistake? Go react again!`,
            }),
        ],
      })
      .catch((e) => {});
  },
};
