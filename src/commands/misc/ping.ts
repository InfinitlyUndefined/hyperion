import { Command } from "@lib";
import { ApplicationCommandType } from "discord.js";

export default new Command({
    name: "ping",
    description: "Pong!",
    type: ApplicationCommandType.ChatInput,

    async callback(interaction) {
        await interaction.reply({
            content: "Pong!"
        })
    },
})