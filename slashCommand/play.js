const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Playing songs")
    .addSubcommand((subCommands) =>
      subCommands
        .setName("songs")
        .setDescription("Loads a single song from a url.")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("The songs url.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("playlist")
        .setDescription("Loads a playlist of songs from a url.")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("The playlist url.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("search")
        .setDescription("search for song based on provided keywords.")
        .addStringOption((option) =>
          option
            .setName("searchterms")
            .setDescription("The search keywords.")
            .setRequired(true)
        )
    ),
  run: async ({ kyuz0, interaction }) => {
    if (!interaction.member.voice.channel)
      return interaction.editReply(
        "You must join in voice channel to use this commands!"
      );

    const queue = await kyuz0.player.createQueue(interaction.guild);
    if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);

    let embed = new MessageEmbed();

    if (interaction.options.getSubcommand() === "song") {
      let url = interaction.options.getString("url");
      const result = await kyuz0.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_VIDEO,
      });

      if (result.tracks.length === 0) return interaction.editReply("No result");

      const song = result.tracks[0];
      await queue.addTrack(song);

      embed
        .setDescription(
          `**[${song.title}](${song.url})** has been added to be queue!`
        )
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duration: ${song.duration}` });
    } else if (interaction.options.getSubcommand() === "playlist") {
      let url = interaction.options.getString("url");
      const result = await kyuz0.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_PLAYLIST,
      });

      if (result.tracks.length === 0) return interaction.editReply("No result");

      const playlist = result.playlist;
      await queue.addTracks(result.tracks);

      embed
        .setDescription(
          `**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** has been added to be queue!`
        )
        .setThumbnail(playlist.thumbnail);
    } else if (interaction.options.getSubcommand() === "search") {
      let url = interaction.options.getString("searchterms");
      const result = await kyuz0.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });

      if (result.tracks.length === 0) return interaction.editReply("No result");

      const song = result.tracks[0];
      await queue.addTrack(song);

      embed
        .setDescription(
          `**[${song.title}](${song.url})** has been added to be queue!`
        )
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duration: ${song.duration}` });
    }

    if (!queue.playing) await queue.play();
    await interaction.editReply({
      embeds: [embed],
    });
  },
};
