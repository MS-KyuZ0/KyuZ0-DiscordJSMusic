const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resumes the music."),
  run: async ({ kyuz0, interaction }) => {
    const queue = kyuz0.player.getQueue(interaction.guildId);

    if (!queue || !queue.playing)
      return await interaction.editReply("There are no songs in the queue!");

    queue.setPaused(false);
    await interaction.editReply(
      "▶ Music has been resumed! Use `/pause` to resume the music."
    );
  },
};
