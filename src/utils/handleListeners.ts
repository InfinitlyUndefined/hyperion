import type { HyperionClient, Listener } from "@lib";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";

export async function handleListeners(
	path: string,
	client: HyperionClient,
): Promise<void> {
	const listeners = readdirSync(resolve(import.meta.dirname, path), {
		recursive: true,
		withFileTypes: true,
	});

	for (const rawListener of listeners) {
		if (rawListener.isDirectory()) continue;
		if (!rawListener.name.endsWith(".js")) continue;

		const { default: listener } = (await import(
			resolve(rawListener.parentPath, rawListener.name)
		)) as { default: Listener };

		client.listeners.set(listener.name, listener);

		if (listener.once) {
			client.once(listener.event, listener.callback);
		} else {
			client.on(listener.event, listener.callback);
		}
	}
}
