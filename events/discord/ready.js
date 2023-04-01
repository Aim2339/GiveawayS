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
  let invite = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=applications.commands%20bot`;
  let uptime = `https://stats.uptimerobot.com/8gMWRsXP3N/`;

  // Update bot's status based on maintenance mode
  if (config.maintenanceMode) {
    client.user.setStatus("dnd");
    client.user.setActivity("Under Maintenance", { type: "PLAYING" });
  } else {
    client.user.setStatus("online");
    const activities = [
      `/help`,
      `All Giveaways!`,
      `${
        client.guilds.cache.reduce((a, g) => a + g.memberCount, 0) -
        client.guilds.cache.size
      } Users in ${client.guilds.cache.size} Servers `,
    ];
    setInterval(() => {
      let activity = activities[Math.floor(Math.random() * activities.length)];
      client.user.setActivity(activity, { type: "WATCHING" });
    }, 40000);
  }

  console.log(
    colors.brightGreen(
      `[Status] ${client.user.tag} is now online!\n[Invite Link] ${invite}\n[Bot Uptime Status] ${uptime}`
    )
  );
};
