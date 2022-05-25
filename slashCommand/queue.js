const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Display the current song queue.")
    .addNumberOption((option) =>
      option
        .setName("page")
        .setDescription("Page number of the queue.")
        .setMinValue(1)
    ),

  run: async ({ kyuz0, interaction }) => {
    const queue = kyuz0.player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return await interaction.editReply("There are no songs in the queue!");

    const totalPages = Math.ceil(queue.tracks.length / 10) || 1;
    const page = (interaction.options.getNumber("page") || 1) - 1;

    if (page > totalPages)
      return await interaction.editReply(
        `Invalid page. There are only a total of ${totalPages} pages of songs.`
      );

    const queueString = queue.tracks
      .slice(page * 10, page * 10 + 10)
      .map((song, i) => {
        return `**${page * 10 + i + 1}.** \`[${song.duration}]\` ${
          song.title
        } -- <@${song.requestedBy.id}>`;
      });
    const currentSong = queue.current;
    await interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setDescription(
            "**💿 Currently Playing**\n" +
              (currentSong
                ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>`
                : "None") +
              `\n\n**📃 Queue**\n${queueString.join("\n")}`
          )
          .setFooter({ text: `Page: ${page + 1} of ${totalPages}` })
          .setThumbnail(currentSong.thumbnail),
      ],
    });
  },
};
