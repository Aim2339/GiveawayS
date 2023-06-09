const { ShardingManager } = require("discord.js");
const colors = require("colors");
const config = require("./config.json");
const manager = new ShardingManager("./index.js", { token: config.TOKEN });

// Trying to spawn the required shards.
manager
  .spawn()
  .catch((error) => console.error(colors.red(`[ERROR/SHARD] Shard failed to spawn.`)));

manager.on("shardCreate", (shard) => {
  // Listeing for the ready event on shard.
  shard.on("ready", () => {
    console.log(
      colors.rainbow(
        `[DEBUG/SHARD] Shard ${shard.id} connected to Discord's Gateway!`
      )
    );
    // Sending the data to the shard.
    shard.send({ type: "shardId", data: { shardId: shard.id } });
  });
});