import { Listener } from "@lib";

export default new Listener({
	name: "initialReady",
	event: "ready",
	once: true,

	async callback(client) {
		console.info(`Logged in as ${client.user.tag}`);
		await client.manager.init();
	},
});
