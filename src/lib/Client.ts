import type { Command, Listener } from "@lib";
import { getCommands, registerCommands } from "@utils";
import { Client, type ClientOptions, type Collection } from "discord.js";
import { type NodeGroup, Poru, type PoruOptions } from "poru";
import { handleListeners } from "../utils/handleListeners";

interface HyperionClientOptions extends ClientOptions {
	commands: Collection<string, Command>;
	listeners: Collection<string, Listener>;
	poruNodes: NodeGroup[];
	poruOptions: PoruOptions;
}

export class HyperionClient<
	Ready extends boolean = boolean,
> extends Client<Ready> {
	public commands: Collection<string, Command>;
	public listeners: Collection<string, Listener>;
	public manager: Poru;

	public constructor(opts: HyperionClientOptions) {
		super(opts);

		this.commands = opts.commands;
		this.listeners = opts.listeners;
		this.manager = new Poru(this, opts.poruNodes, opts.poruOptions);
	}

	public override async login(token?: string): Promise<string> {
		await getCommands("commands", this);
		await handleListeners("events", this);
		const promiseString = await super.login(token);
		await registerCommands(this);
		return promiseString;
	}
}

declare module "discord.js" {
	interface Client {
		commands: Collection<string, Command>;
		listners: Collection<string, Listener>;
		manager: Poru;
	}
}
