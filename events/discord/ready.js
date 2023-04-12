const register = require("../../utils/slashsync");
const colors = require("colors");
const config = require("../../config.json");

module.exports = async (client) => {
  await register(
    client,
    client.register_arr.map((command) => ({
      name: command.name,
      description: command.description,
      options: command.options,
      type: "CHAT_INPUT",
    })),
    {
      debug: true,
    }
  );

  console.log(
    colors.brightGreen(`[ / | Slash Command ] - ✅ Loaded all slash commands!`)
  );
  const invite = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot`;
  const uptime = `https://stats.uptimerobot.com/8gMWRsXP3N/`;

  // Update bot's status based on maintenance mode
  if (config.maintenanceMode) {
    client.user.setStatus("dnd");
    client.user.setActivity("Under Maintenance", { type: "PLAYING" });
  } else {
    client.user.setStatus("online");
    client.user.setActivity("/help", { type: "LISTENING" });
  }

  console.log(
    colors.brightGreen(
      `[Status] ${client.user.tag} is now online!\n[Invite Link] ${invite}\n[Bot Uptime Status] ${uptime}`
    )
  );
};
