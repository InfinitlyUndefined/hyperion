import { Listener } from "@lib";

export default new Listener({
	name: "standardCreate",
	event: "interactionCreate",

	async callback(interaction) {
		if (
			interaction.isChatInputCommand() ||
			interaction.isContextMenuCommand()
		) {
			const command = interaction.client.commands.find(
				(cmd) => cmd.name === interaction.commandName,
			);
			if (!command) {
				await interaction.reply({
					content: "There was an error running this command",
					ephemeral: true,
				});
				return;
			}

			await command.callback(interaction);
		}

		if (interaction.isAutocomplete()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (command?.autoComplete) {
				await command.autoComplete(interaction);
			}
		}
	},
});
