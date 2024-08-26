import type { ClientEvents } from "discord.js";

interface ListnerOptions<E extends keyof ClientEvents> {
	name: string;
	event: E;
	once?: boolean;

	callback: (...args: ClientEvents[E]) => Promise<void>;
}

export class Listener<E extends keyof ClientEvents = keyof ClientEvents> {
	public name: string;
	public event: keyof ClientEvents;
	public once?: boolean;

	public callback: (...args: ClientEvents[E]) => Promise<void>;

	public constructor(opts: ListnerOptions<E>) {
		this.name = opts.name;
		this.event = opts.event;
		this.once = opts.once;

		this.callback = opts.callback;
	}
}
