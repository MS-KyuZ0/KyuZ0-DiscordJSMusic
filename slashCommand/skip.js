const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current song."),
  run: async ({ kyuz0, interaction }) => {
    const queue = kyuz0.player.getQueue(interaction.guildId);

    if (!queue || !queue.playing)
      return await interaction.editReply("There are no songs in the queue!");

    const currentSong = queue.current;

    queue.skip();
    await interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setDescription(`⏭ ${currentSong.title} has been skipped!`)
          .setThumbnail(currentSong.thumbnail),
      ],
    });
  },
};
