const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("quit")
    .setDescription("Stop the bot and clear the queue."),
  run: async ({ kyuz0, interaction }) => {
    const queue = kyuz0.player.getQueue(interaction.guildId);

    if (!queue || !queue.playing)
      return await interaction.editReply("There are no songs in the queue!");

    queue.destroy();
    await interaction.editReply("Bye!");
  },
};
