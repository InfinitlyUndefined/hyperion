import { Command } from "@lib";
import { ApplicationCommandOptionType, ApplicationCommandType, Colors, type GuildMember } from "discord.js";

export default new Command({
     type: ApplicationCommandType.ChatInput,
     name: "volume",
     description: "Set the volume",
     guildIds: ["1241910348487987230"],
     options: [
        {
            type: ApplicationCommandOptionType.Integer,
            name: "percent",
            description: "The percent to set the volume to",
            minValue: 0,
            maxValue: 100,
            required: true
        }
     ],

     async callback(interaction) {
        const {guild, client} = interaction;

        if (!guild) return;

         const volume = interaction.options.getInteger("percent", true);
         const member = interaction.member as GuildMember;
         const player = interaction.client.manager.get(guild.id)

         if (!player) {
            await interaction.reply({
                content: "There is no player in this server",
                ephemeral: true
            })

            return;
         }

         if (!member.voice.channelId) {
            await interaction.reply({
                content: "You are not in a voice channel",
                ephemeral: true
            })

            return;
         }

         await player.setVolume(volume)

         await interaction.reply({
            embeds: [
				{
					color: Colors.Blurple,
					author: {
						name: guild.name,
						icon_url: guild.iconURL() ?? undefined,
					},
					description: "🔈 | Changed the volume of the player",
					timestamp: new Date().toISOString(),
					footer: {
						text: "Thanks for using Hyperion!",
						icon_url: client.user.displayAvatarURL(),
					},
				},
            ]
         })
     },
})