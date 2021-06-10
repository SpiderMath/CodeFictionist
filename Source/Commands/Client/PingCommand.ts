import { Message } from "discord.js";
import BaseCommand from "../../Base/BaseCommand";
import CodeFictionistClient from "../../Base/Client";

export default class PingCommand extends BaseCommand {
	constructor(client: CodeFictionistClient) {
		super(client, {
			name: "ping",
			description: "Gets API Latency of the bot",
			aliases: ["pong"],
		});
	}

	async run(message: Message) {
		const msg = await message.channel.send("Pinging...");
		msg.edit(`${msg.createdTimestamp - message.createdTimestamp} ms`);
	}
};