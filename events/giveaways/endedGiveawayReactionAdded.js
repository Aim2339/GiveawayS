const Discord = require("discord.js");
module.exports = {
  async execute(giveaway, member, reaction) {
    reaction.users.remove(member.user);
    member
      .send({
        embeds: [
          new Discord.MessageEmbed()
            .setTitle(`Giveaway ended already!`)
            .setColor("RANDOM")
            .setDescription(
              `Hey ${member.user} **[[This Giveaway]](https://discord.com/channels/${giveaway.guildId}/${giveaway.channelId}/${giveaway.messageId})** that you reacted has already ended :sob:\nBe quick next time!`
            )
            .setTimestamp(),
        ],
      })
      .catch((e) => {});
  },
};
