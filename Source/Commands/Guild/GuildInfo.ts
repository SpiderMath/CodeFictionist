import { stripIndents } from "common-tags";
import { Guild, Message } from "discord.js";
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
		// @ts-ignore
		const guild: Guild = message.guild;

		const serverInfoEmbed = this.client.embed(message.author)
			.setThumbnail(`${guild.iconURL()}`)
			.setTitle(`${guild.name}`)
			.addField("Owner", `<@!${guild.ownerID}>`, true)
			.addField("ID", `${guild.id}`, true)
			.addField("Created At", `${guild.createdAt.toLocaleDateString("en-us")} ${guild.createdAt.toLocaleTimeString("en-us")}`)
			.addField("Region", guild.region, true)
			.addField("Verification Level", `${guild.verificationLevel.split("").map((str, position) => {
				if(position === 0) return str.toUpperCase();
				else return str.toLowerCase();
			}).join("")}`, true)
			.addField("Total Members", `${guild.memberCount}`, true)
			.addField("Bots", `${guild.members.cache.filter(m => m.user.bot).size || 0}`, true)
			.addField("Boosters", `${guild.premiumSubscriptionCount || 0}`, true)
			.addField("Roles", `${guild.roles.cache.size}`, true)
			.addField("Channels", `${guild.channels.cache.filter(ch => ch.type !== "category").size}`, true)
			.addField("Text Channels", `${guild.channels.cache.filter(ch => (ch.type === "text") || (ch.type === "news") || (ch.type === "store")).size}`, true)
			.addField("Voice Channels", `${guild.channels.cache.filter(ch => (ch.type === "voice") || (ch.type === "stage")).size}`, true)
			.addField("Emojis", stripIndents`
				**Animated:** ${guild.emojis.cache.filter(em => em.animated).size || 0}
				**Normal:** ${guild.emojis.cache.filter(em => !em.animated).size || 0}
			`, true);

		this.client.sendEmbed(message, serverInfoEmbed);
	}
}