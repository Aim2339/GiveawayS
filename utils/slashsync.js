const Discord = require("discord.js");
const colors = require("colors");

module.exports = async (
  client,
  commands,
  options = {
    debug: false,
    guildId: null,
  }
) => {
  const log = (message) => options.debug && console.log(message);

  const ready = client.readyAt
    ? Promise.resolve()
    : new Promise((resolve) => client.once("ready", resolve));
  await ready;
  const currentCommands = await client.application.commands.fetch(
    options.guildId && { guildId: options.guildId }
  );

  log(colors.brightMagenta(`Synchronizing commands...`));
  log(
    colors.brightMagenta(
      `Currently ${currentCommands.size} commands are registered to the bot!`
    )
  );

  const newCommands = commands.filter(
    (command) => !currentCommands.some((c) => c.name === command.name)
  );
  for (let newCommand of newCommands) {
    await client.application.commands.create(newCommand, options.guildId);
  }

  log(colors.brightMagenta(`Created ${newCommands.length} commands!`));

  const deletedCommands = currentCommands
    .filter((command) => !commands.some((c) => c.name === command.name))
    .toJSON();
  for (let deletedCommand of deletedCommands) {
    await deletedCommand.delete();
  }

  log(colors.brightMagenta(`Deleted ${deletedCommands.length} commands!`));

  const updatedCommands = commands.filter((command) =>
    currentCommands.some((c) => c.name === command.name)
  );
  let updatedCommandCount = 0;
  for (let updatedCommand of updatedCommands) {
    const newCommand = updatedCommand;
    const previousCommand = currentCommands.find(
      (c) => c.name === updatedCommand.name
    );
    let modified = false;
    if (previousCommand.description !== newCommand.description) modified = true;
    if (
      !Discord.ApplicationCommand.optionsEqual(
        previousCommand.options ?? [],
        newCommand.options ?? []
      )
    )
      modified = true;
    if (modified) {
      await previousCommand.edit(newCommand);
      updatedCommandCount++;
    }
  }

  log(colors.brightMagenta(`Updated ${updatedCommandCount} commands!`));

  log(colors.brightMagenta(`Commands synchronized!`));

  return {
    currentCommandCount: currentCommands.size,
    newCommandCount: newCommands.length,
    deletedCommandCount: deletedCommands.length,
    updatedCommandCount,
  };
};
