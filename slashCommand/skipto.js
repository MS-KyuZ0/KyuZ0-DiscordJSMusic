const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skipto")
    .setDescription("Skips to a certain track #.")
    .addNumberOption((option) =>
      option
        .setName("tracknumber")
        .setDescription("The track to skip to.")
        .setMinValue(1)
        .setRequired(true)
    ),
  run: async ({ kyuz0, interaction }) => {
    const queue = kyuz0.player.getQueue(interaction.guildId);

    if (!queue || !queue.playing)
      return await interaction.editReply("There are no songs in the queue!");

    const currentSong = queue.current;

    const trackNum = interaction.options.getNumber("tracknumber");
    if (trackNum > queue.tracks.length)
      return await interaction.editReply("Invalid track number!");

    queue.skipTo(trackNum - 1);
    await interaction.editReply(`⏭ Skipped ahead to track number ${trackNum}`);
  },
};
