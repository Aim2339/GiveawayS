const fs = require("fs");
const config = require("../config.json");

module.exports.run = async (client, message, args) => {
  if (message.author.id !== config.ownerID) {
    return;
  }

  const mode = args[0];

  if (!mode) {
    return message.reply(
      `Please specify a mode (\`true/false\`). Current mode is \`${config.maintenanceMode}\`.`
    );
  }

  if (mode !== "true" && mode !== "false") {
    return message.reply(
      "Invalid mode. Please specify either `true` or `false`."
    );
  }

  config.maintenanceMode = mode === "true";

  fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => {
    if (err) {
      console.error(err);
      return message.reply(
        "An error occurred while changing maintenance mode."
      );
    }

    message.reply(`Maintenance mode has been set to \`${mode}\`.`);
  });
};
