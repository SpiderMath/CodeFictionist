import BaseEvent from "../Base/BaseEvent";
import CodeFictionistClient from "../Base/Client";

export default class ReadyEvent extends BaseEvent {
	constructor(client: CodeFictionistClient) {
		super("ready", client);
	}

	async run() {
		console.log(`Logged in as ${this.client.user?.tag}`);

		this.client.prefixes.push(`<@${this.client.user?.id}>`);
		this.client.prefixes.push(`<@!${this.client.user?.id}>`);
	}
};