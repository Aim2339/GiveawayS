const Discord = require("discord.js");
const client = new Discord.Client({ intents: 7753 });
module.exports = client;
const fs = require("fs");
const colors = require("colors");
const config = require("./config.json");
client.config = config;

// Connect to the database
const mongoose = require("mongoose");
mongoose.connect(`${process.env.MONGO_URL}`);
const db = mongoose.connection;

// Check the connection
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log(colors.rainbow("[MongoDB] Connected to MongoDB!"));
});

// Create the model
const giveawayModel = require("./schema/giveaway");

const { GiveawaysManager } = require("discord-giveaways");
const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
  // This function is called when the manager needs to get all giveaways which are stored in the database.
  async getAllGiveaways() {
    // Get all giveaways from the database. We fetch all documents by passing an empty condition.
    return await giveawayModel.find().lean().exec();
  }

  // This function is called when a giveaway needs to be saved in the database.
  async saveGiveaway(messageId, giveawayData) {
    // Add the new giveaway to the database
    await giveawayModel.create(giveawayData);
    // Don't forget to return something!
    return true;
  }

  // This function is called when a giveaway needs to be edited in the database.
  async editGiveaway(messageId, giveawayData) {
    // Find by messageId and update it
    await giveawayModel.updateOne({ messageId }, giveawayData).exec();
    // Don't forget to return something!
    return true;
  }

  // This function is called when a giveaway needs to be deleted from the database.
  async deleteGiveaway(messageId) {
    // Find by messageId and delete it
    await giveawayModel.deleteOne({ messageId }).exec();
    // Don't forget to return something!
    return true;
  }
};

// Create a new instance of your new class
const manager = new GiveawayManagerWithOwnDatabase(
  client,
  {
    default: {
      botsCanWin: false,
      embedColor: "RANDOM",
      reaction: "🎉",
      lastChance: {
        enabled: true,
        content: `🛑 **Last chance to enter** 🛑`,
        threshold: 10000,
        embedColor: "#FF0000",
      },
    },
  },
  false
); // ATTENTION: Add "false" in order to not start the manager until the DB got checked, see below
// We now have a giveawaysManager property to access the manager everywhere!
client.giveawaysManager = manager;

fs.readdir("./events/discord", (_err, files) => {
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/discord/${file}`);
    let eventName = file.split(".")[0];
    console.log(colors.blue(`[Event]   ✅  Loaded: ${eventName}`));
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/discord/${file}`)];
  });
});

fs.readdir("./events/giveaways", (_err, files) => {
  client.giveawaysManager._init();
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/giveaways/${file}`);
    let eventName = file.split(".")[0];
    console.log(colors.blue(`[Event]   🎉 Loaded: ${eventName}`));
    client.giveawaysManager.on(eventName, (...file) =>
      event.execute(...file, client)
    ),
      delete require.cache[require.resolve(`./events/giveaways/${file}`)];
  });
});

client.commands = new Discord.Collection();

client.interactions = new Discord.Collection();

client.register_arr = [];
fs.readdir("./slash/", (_err, files) => {
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    let props = require(`./slash/${file}`);
    let commandName = file.split(".")[0];
    client.interactions.set(commandName, {
      name: commandName,
      ...props,
    });
    client.register_arr.push(props);
  });
});

const http = require("http");
http
  .createServer(function (req, res) {
    res.write("Bot is online!");
    res.end();
  })
  .listen(8080);
let started = false;

client.once("ready", () => (started = true));
const { spawn } = require("child_process");
setTimeout(() => {
  if (!started) spawn("kill", ["1"]);
}, 15000);

client.login(process.env.TOKEN);
