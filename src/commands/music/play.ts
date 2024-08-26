import { Command } from "@lib";
import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
	Colors,
	type GuildMember,
} from "discord.js";

export default new Command({
	name: "play",
	description: "Play a song!",
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: "song",
			description: "The song you want to play",
			type: ApplicationCommandOptionType.String,
			required: true,
			autocomplete: true,
		},
	],
	guildIds: ["1241910348487987230"],

	async autoComplete(interaction) {
		const query = interaction.options.getFocused();

		const res = await interaction.client.manager.resolve({
			query,
			requester: interaction.member,
			source: "ytsearch",
		});

		if (res.loadType === "playlist") {
			await interaction.respond([
				{
					// biome-ignore lint/style/noNonNullAssertion: Fuck off cuntzilla
					name: res.playlistInfo.name!,
					value: query,
				},
			]);

			return;
		}

		const tracks = res.tracks.slice(0, 10);

		await interaction.respond(
			tracks.map((track) => ({
				name: `${track.info.title} - ${track.info.author}`.slice(0, 100),
				// biome-ignore lint/style/noNonNullAssertion: Fuck off
				value: track.info.uri!,
			})),
		);
	},

	async callback(interaction) {
		const { client, guild } = interaction;
		if (!guild) return;
		const query = interaction.options.getString("song", true);
		const member = interaction.member as GuildMember;
		if (!interaction.channel) return;
		const res = await client.manager.resolve({
			query,
		});

		if (!member.voice.channel) return;
		let player = client.manager.players.get(guild.id);
		if (!player) {
			player = client.manager.createConnection({
				guildId: guild.id,
				voiceChannel: member.voice.channel.id,
				textChannel: interaction.channel.id,
				deaf: true,
			});
		}

		switch (res.loadType) {
			case "empty": {
				await interaction.reply({
					embeds: [
						{
							color: Colors.Blurple,
							description: "No results found",
							timestamp: new Date().toISOString(),
						},
					],
				});
				return;
			}
			case "error": {
				await interaction.reply({
					embeds: [
						{
							color: Colors.Red,
							description: "An error occurred while fetching the track",
							timestamp: new Date().toISOString(),
							author: {
								name: guild.name,
								icon_url: guild.iconURL() ?? undefined,
							},
							footer: {
								text: "Thanks for using Hyperion!",
								icon_url: client.user.displayAvatarURL(),
							},
						},
					],
				});
				return;
			}
			case "playlist": {
				for (const track of res.tracks) {
					player.queue.add(track);
				}
				if (!player.isPlaying && !player.isPaused) player.play();
				await interaction.reply({
					embeds: [
						{
							color: Colors.Blurple,
							description: `Added ${res.tracks.length} tracks to the queue from playlist [${res.playlistInfo.name}](${query})`,
							timestamp: new Date().toISOString(),
							thumbnail: {
								url: res.tracks[0].info.artworkUrl ?? "",
							},
							author: {
								name: guild.name,
								icon_url: guild.iconURL() ?? undefined,
							},
							footer: {
								text: "Thanks for using Hyperion!",
								icon_url: client.user.displayAvatarURL(),
							},
						},
					],
				});
				return;
			}
			case "track": {
				player.queue.add(res.tracks[0]);
				if (!player.isPlaying && !player.isPaused) player.play();
				await interaction.reply({
					embeds: [
						{
							color: Colors.Blurple,
							description: `Added [${res.tracks[0].info.title}](${res.tracks[0].info.uri}) to the queue`,
							timestamp: new Date().toISOString(),
							thumbnail: {
								url: res.tracks[0].info.artworkUrl ?? "",
							},
							author: {
								name: guild.name,
								icon_url: guild.iconURL() ?? undefined,
							},
							footer: {
								text: "Thanks for using Hyperion!",
								icon_url: client.user.displayAvatarURL(),
							},
						},
					],
				});
				return;
			}
		}
	},
});
