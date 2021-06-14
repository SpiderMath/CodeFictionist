import { Message } from "discord.js";
import BaseCommand from "../../Base/BaseCommand";
import CodeFictionistClient from "../../Base/Client";

export default class ServerInfo extends BaseCommand {
	constructor(client: CodeFictionistClient) {
		super(client, {
			name: "server-info",
			aliases: ["serverinfo", "server", "serverstats"],
			description: "Gets the info of the server",
		});
	}
	async run(message: Message) {
		const serverInfoEmbed = this.client.embed(message.author)
			// @ts-ignore
			.setThumbnail(message.guild?.iconURL())
			// @ts-ignore
			.setTitle(message.guild.name)
			// @ts-ignore
			.addField("Owner:- ", `${message.guild?.ownerID}`, true)
			.addField("ID:- ", `${message.guild?.id}`, true)
			.addField("Created At:- ", `${message.guild?.createdAt.toLocaleDateString("en-us")} ${message.guild?.createdAt.toLocaleTimeString("en-us")}`)
			.addField("Region:- ", "India", true)
			.addField("Verification Level:- ", `${message.guild?.verificationLevel}`, true)
			.addField("Total Members:- ", `${message.guild?.memberCount}`, true)
			.addField("Online Members:- ", `${message.guild?.members.cache.filter(m => m.user.presence.status == "online").size}`, true)
			.addField("Bots:- ", `${message.guild?.members.cache.filter(m => m.user.bot).size}`, true)
			// @ts-ignore
			.addField("Boosters:- ", `${message.guild?.premiumSubscriptionCount}`, true)
			.addField("Roles:- ", `${message.guild?.roles.cache.size}`, true)
			.addField("Channels:- ", `${message.guild?.channels.cache.size}`, true)
			.addField("Text Channels:- ", `${message.guild?.channels.cache.filter(r => r.type === "text").size}`, true)
			.addField("Voice Channels:- ", `${message.guild?.channels.cache.filter(c => c.type === "voice").size}`)
			.addField("Emojis:- ", `${message.guild?.emojis.cache.size}`, true);

		this.client.sendEmbed(message, serverInfoEmbed);
	}
}