import { HyperionClient } from "@lib";
import { Collection, GatewayIntentBits } from "discord.js";

const { PORU_HOST, PORU_NAME, PORU_PASS, PORU_PORT } = process.env;

if (!PORU_HOST || !PORU_NAME || !PORU_PASS || !PORU_PORT)
	throw new Error("Poru env variable missing");

const client = new HyperionClient({
	commands: new Collection(),
	listeners: new Collection(),
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
	poruNodes: [
		{
			host: PORU_HOST,
			name: PORU_NAME,
			password: PORU_PASS,
			port: Number(PORU_PORT),
		},
	],
	poruOptions: {
		library: "discord.js",
		reconnectTries: Number.POSITIVE_INFINITY,
		reconnectTimeout: 5,
	},
});

client.manager.on("nodeConnect", (node) => {
	console.info(`Connected to ${node.name} node`);
});

await client.login(process.env.DISCORD_TOKEN);
