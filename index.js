require("dotenv").config();
const Discord = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Player } = require("discord-player");
const fs = require("fs");
const CLIENT_ID = "682431071693963308";
const GUILD_ID = "885936150022340638";

const kyuz0 = new Discord.Client({ intents: ["GUILDS", "GUILD_VOICE_STATES"] });

kyuz0.slashCommands = new Discord.Collection();
kyuz0.player = new Player(kyuz0, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
});

let commands = [];

const slashFiles = fs
  .readdirSync("./slashCommand")
  .filter((f) => f.endsWith(".js"));

for (const file of slashFiles) {
  const slashCmd = require(`./slashCommand/${file}`);
  kyuz0.slashCommands.set(slashCmd.data.name, slashCmd);
  commands.push(slashCmd.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

kyuz0.on("ready", () => {
  console.log(`[SYSTEM] Login as ${kyuz0.user.tag}`);
  kyuz0.user.setActivity("Music!", { type: "LISTENING" });
});

kyuz0.on("interactionCreate", (interaction) => {
  async function handleCommand() {
    if (!interaction.isCommand()) return;

    const slashCmd = kyuz0.slashCommands.get(interaction.commandName);
    if (!slashCmd) interaction.reply("Invalid slash commands!");

    await interaction.deferReply();
    await slashCmd.run({ kyuz0, interaction });
  }
  handleCommand();
});
kyuz0.login(process.env.TOKEN);
