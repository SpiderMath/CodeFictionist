import { stripIndents } from "common-tags";
import { Message } from "discord.js";
import BaseCommand from "../../Base/BaseCommand";
import CodeFictionistClient from "../../Base/Client";

export default class MemberCount extends BaseCommand {
	constructor(client: CodeFictionistClient) {
		super(client, {
			name: "membercount",
			description: "Get's the number of member of CodeFiction",
			aliases: ["users", "members", "member-count"],
			guildOnly: true,
		});
	}
	async run(message: Message) {
		const embed = this.client.embed(message.author)
			.setTitle("**Member Count**")
			// @ts-ignore
			.setThumbnail(message.guild?.iconURL({ dynamic: true }))
			.addField("Members", `**${message.guild?.memberCount}**`, true)
			.addField("Humans", `**${message.guild?.members.cache.filter(member => !member.user.bot).size}**`, true)
			.addField("Bots", `**${message.guild?.members.cache.filter(member => member.user.bot).size}**`, true)
			.addField("Member Status", stripIndents`
				**${message.guild?.members.cache.filter(o => o.presence.status === "online").size}** Online
				**${message.guild?.members.cache.filter(i => i.presence.status === "idle").size}** Inactive
				**${message.guild?.members.cache.filter(dnd => dnd.presence.status === "dnd").size}** Do Not Disturb
				**${message.guild?.members.cache.filter(off => off.presence.status === "offline").size}** Offline/ Invisible
				`);

		message.channel.send({ embed: embed });
		this.client.embed(message.author);
	}
}