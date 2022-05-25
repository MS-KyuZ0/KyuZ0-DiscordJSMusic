const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Display info about the currently playing song."),
  run: async ({ kyuz0, interaction }) => {
    const queue = kyuz0.player.getQueue(interaction.guildId);

    if (!queue || !queue.playing)
      return await interaction.editReply("There are no songs in the queue!");

    let bar = queue.createProgressBar({
      queue: false,
      length: 19,
    });
    const song = queue.current;
    await interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setThumbnail(song.setThumbnail)
          .setDescription(
            `💿 **Currently Playing:**\n [${song.title}](${song.url}) - \`${song.duration}\`\n\n` +
              bar
          ),
      ],
    });
  },
};
