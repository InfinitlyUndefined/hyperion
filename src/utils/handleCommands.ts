import type { Command, HyperionClient } from "@lib";
import type { ApplicationCommandData } from "discord.js";
import { readdirSync } from "fs";
import { resolve } from "path";

async function checkCommand(command: ApplicationCommandData, client: HyperionClient): Promise<void> {
    console.info(`Checking ${command.name} Command`)
}

async function registerCommands(client: HyperionClient): Promise<void> {
    if (!client.application) throw new Error("Client has not established an application!");

    console.info("Checking Application (/) Commands")

    let clientCommands = await client.application.commands.fetch();
    const toRemove = clientCommands.filter((cmd) => !client.commands.has(cmd.name))
    clientCommands = clientCommands.filter((cmd) => client.commands.has(cmd.name))

    console.info(`Found ${clientCommands.size} Commands`)

    if (toRemove) {
        for (const remove of toRemove) {
            console.info(`Removing ${toRemove.size} Commands`)
            await remove[1].delete()
            console.info(`Removed ${remove[1].name} Command`)
        }
    }

    for (const command of client.commands.values()) {
        const providedCommandData: ApplicationCommandData = {
            name: command.name,
            description: command.description,
            defaultMemberPermissions: command.defaultMemberPermissions,
            dmPermission: command.dmPermission,
            options: command.options,
            type: command.type
        }

        await checkCommand(providedCommandData, client)
    }
}

async function getCommands(path: string, client: HyperionClient): Promise<void> {
    const resolvedPath = resolve(import.meta.dirname, path)

    const commands = readdirSync(resolvedPath, {recursive: true, withFileTypes: true})
    
    for (const rawCommand of commands) {
        if (rawCommand.isDirectory()) continue;
        if (!rawCommand.name.endsWith(".js")) continue;
        
        const commandPath = resolve(rawCommand.parentPath, rawCommand.name)

        const {default: command} = await import(commandPath) as {default: Command}

        client.commands.set(command.name, command)
    }
}

export async function handleCommands(path: string, client: HyperionClient): Promise<any[]> {
    return Promise.all([getCommands(path, client), registerCommands(client)])
}