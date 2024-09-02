import { Command } from "@lib";
import { ApplicationCommandType, Colors } from "discord.js";

export default new Command({
	type: ApplicationCommandType.ChatInput,
	name: "stop",
	description: "Stop the music",
	guildIds: ["1241910348487987230"],

	async callback(interaction) {
		const { client, guild } = interaction;
		if (!guild) return;
		const player = client.manager.players.get(guild.id);
		if (!player) return;
		player.destroy();
		await interaction.reply({
			embeds: [
				{
					color: Colors.Blurple,
					author: {
						name: guild.name,
						icon_url: guild.iconURL() ?? undefined,
					},
					description: "⏹️ | Stopped the music",
					timestamp: new Date().toISOString(),
					footer: {
						text: "Thanks for using Hyperion!",
						icon_url: client.user.displayAvatarURL(),
					},
				},
			],
		});
	},
});
