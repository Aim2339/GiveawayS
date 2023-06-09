const Dokdo = require("dokdo");
const config = require("../config.json");

module.exports.run = async (client, message, args) => {
      // Check if the message author is the bot's owner
  if (message.author.id !== config.ownerID) {
    return;
  }

  const dokdo = new Dokdo(client, { owners: ['1035467531646947328', '756060979896385606'], prefix: '!' });

  dokdo.run(message);
};
