import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import type { Command, HyperionClient } from "@lib";
import type { ApplicationCommandData } from "discord.js";

async function checkCommand(
	command: ApplicationCommandData,
	client: HyperionClient,
	guildIds?: string[],
): Promise<void> {
	if (!client.application)
		throw new Error("Client hasn't established an application!");
	console.info(`Checking ${command.name} Command`);

	if (guildIds) {
		for (const id of guildIds) {
			const guild = await client.guilds.fetch(id);
			if (!guild)
				throw new Error(`Guild Id ${id} in ${command.name} Command is Invalid`);

			const guildCommand = (await guild.commands.fetch()).find(
				(cmd) => cmd.name === command.name,
			);

			if (!guildCommand) {
				console.info(`Creating ${command.name} Command -> ${guild.name}`);
				guild.commands.create(command);
			} else {
				if (!guildCommand.equals(command, true)) {
					console.info(`Updating ${command.name} Command -> ${guild.name}`);
					await guildCommand.edit(command);
				}
			}
		}
		return;
	}

	const clientCommand = (await client.application.commands.fetch()).find(
		(cmd) => cmd.name === command.name,
	);

	if (!clientCommand) {
		console.info(`Creating ${command.name} Command`);
		await client.application.commands.create(command);
	} else {
		if (!clientCommand.equals(command, true)) {
			await clientCommand.edit(command);
			console.info(`Updated ${command.name} Command`);
		}

		console.info(`Finished Checking ${command.name} Command`);
	}
}

export async function registerCommands(client: HyperionClient): Promise<void> {
	if (!client.application)
		throw new Error("Client has not established an application!");

	console.info("Checking Application (/) Commands");

	let clientCommands = await client.application.commands.fetch();
	const toRemove = clientCommands.filter(
		(cmd) => !client.commands.has(cmd.name),
	);
	clientCommands = clientCommands.filter((cmd) =>
		client.commands.has(cmd.name),
	);

	for (const command of clientCommands.values()) {
		const localCommand = client.commands.find(
			(cmd) => cmd.name === command.name,
		);

		if (localCommand?.guildIds) {
			console.info(`Deleting Global Command ${command.name}`);
			await command.delete();
		}
	}

	console.info(`Found ${clientCommands.size} Global Commands`);

	if (toRemove) {
		for (const remove of toRemove) {
			console.info(`Removing ${toRemove.size} Commands`);
			await remove[1].delete();
			console.info(`Removed ${remove[1].name} Command`);
		}
	}

	for (const command of client.commands.values()) {
		const providedCommandData: ApplicationCommandData = {
			name: command.name,
			description: command.description,
			defaultMemberPermissions: command.defaultMemberPermissions,
			dmPermission: command.dmPermission,
			options: command.options,
			type: command.type,
		};

		if (command.guildIds) {
			await checkCommand(providedCommandData, client, command.guildIds);
		} else {
			await checkCommand(providedCommandData, client);
		}
	}
}

export async function getCommands(
	path: string,
	client: HyperionClient,
): Promise<void> {
	const resolvedPath = resolve(import.meta.dirname, path);

	const commands = readdirSync(resolvedPath, {
		recursive: true,
		withFileTypes: true,
	});

	for (const rawCommand of commands) {
		if (rawCommand.isDirectory()) continue;
		if (!rawCommand.name.endsWith(".js")) continue;

		const commandPath = resolve(rawCommand.parentPath, rawCommand.name);

		const { default: command } = (await import(commandPath)) as {
			default: Command;
		};

		client.commands.set(command.name, command);
	}
}
