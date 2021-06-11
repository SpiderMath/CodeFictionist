import { Message } from "discord.js";
import BaseEvent from "../Base/BaseEvent";
import CodeFictionistClient from "../Base/Client";

export default class MessageEvent extends BaseEvent {
	constructor(client: CodeFictionistClient) {
		super("message", client);
	}

	async run(message: Message) {
		if(message.author.bot) return;

		let prefix: string;

		for(const pref of this.client.prefixes) {
			if(message.content.toLowerCase().startsWith(pref.toLowerCase())) {
				prefix = pref;
				break;
			}
		}

		// @ts-ignore
		if(!prefix) return;

const args = message.content.slice(prefix.length).trim().split(/ +/g);
		const commandName = args.shift()?.toLowerCase();

		// @ts-ignore
		const command = this.client.commands.get(commandName);

		if(!command) return;

		try {
			await command.run(message, args);
		}
		catch(err) {
			console.log("something happened");
		}
	}
};