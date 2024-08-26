import { Command } from "@lib";
import { ApplicationCommandType } from "discord.js";

export default new Command({
	name: "ping",
	description: "Pong!",
	type: ApplicationCommandType.ChatInput,
	guildIds: ["1241910348487987230"],

	async callback(interaction) {
		await interaction.reply({
			content: "Pong!",
		});
	},
});
