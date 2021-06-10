import { ClientEvents } from "discord.js";
import CodeFictionistClient from "./Client";

export default abstract class BaseEvent {
	public name: keyof ClientEvents;
	public client: CodeFictionistClient;

	constructor(eventName: keyof ClientEvents, client: CodeFictionistClient) {
		this.name = eventName;
		this.client = client;

		Object.defineProperty(
			this,
			"client",
			{
				enumerable: false,
				configurable: true,
				writable: true,
			},
		);
	}

	// eslint-disable-next-line
	abstract run(...args: any[]): Promise<any>;
};