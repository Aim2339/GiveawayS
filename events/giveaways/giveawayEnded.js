const Discord = require("discord.js");
module.exports = {
  async execute(giveaway, winners) {
    winners.forEach((member) => {
      member
        .send({
          embeds: [
            new Discord.MessageEmbed()
              .setTitle(`:tada: Let's goo!`)
              .setColor("RANDOM")
              .setDescription(
                `Hello there ${member.user}\n :gift: I heard that you have won **[[This Giveaway]](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})**\n :clap: Good Job On Winning **${giveaway.prize}!**\nDM/Ping the host to claim your prize!!`
              )
              .setTimestamp(),
          ],
        })
        .catch((e) => {});
    });
  },
};
