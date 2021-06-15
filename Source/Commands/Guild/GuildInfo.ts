import { stripIndents } from "common-tags";
import { Message } from "discord.js";
import BaseCommand from "../../Base/BaseCommand";
import CodeFictionistClient from "../../Base/Client";

export default class ServerInfo extends BaseCommand {
	constructor(client: CodeFictionistClient) {
		super(client, {
			name: "server-info",
			aliases: ["serverinfo", "server", "serverstats"],
			description: "Gets the info of the server",
			guildOnly: true,
		});
	}
	async run(message: Message) {
		const serverInfoEmbed = this.client.embed(message.author)
			.setThumbnail(`${message.guild?.iconURL()}`)
			.setTitle(`${message.guild?.name}`)
			.addField("Owner", `<@!${message.guild?.ownerID}>`, true)
			.addField("ID", `${message.guild?.id}`, true)
			.addField("Created At", `${message.guild?.createdAt.toLocaleDateString("en-us")} ${message.guild?.createdAt.toLocaleTimeString("en-us")}`)
			.addField("Region", "India", true)
			.addField("Verification Level", `${message.guild?.verificationLevel.split("").map((str, position) => {
				if(position === 0) return str.toUpperCase();
				else return str.toLowerCase();
			}).join("")}`, true)
			.addField("Total Members", `${message.guild?.memberCount}`, true)
			.addField("Bots", `${message.guild?.members.cache.filter(m => m.user.bot).size || 0}`, true)
			.addField("Boosters", `${message.guild?.premiumSubscriptionCount || 0}`, true)
			.addField("Roles", `${message.guild?.roles.cache.size}`, true)
			.addField("Channels", `${message.guild?.channels.cache.filter(ch => ch.type !== "category").size}`, true)
			.addField("Text Channels", `${message.guild?.channels.cache.filter(ch => (ch.type === "text") || (ch.type === "news") || (ch.type === "store")).size}`, true)
			.addField("Voice Channels", `${message.guild?.channels.cache.filter(ch => (ch.type === "voice") || (ch.type === "stage")).size}`, true)
			.addField("Emojis", stripIndents`
				**Animated:** ${message.guild?.emojis.cache.filter(em => em.animated).size || 0}
				**Normal:** ${message.guild?.emojis.cache.filter(em => !em.animated).size || 0}
			`, true);

		this.client.sendEmbed(message, serverInfoEmbed);
	}
}