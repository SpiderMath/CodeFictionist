import { stripIndents } from "common-tags";
import { Guild, Message } from "discord.js";
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
		// @ts-ignore
		const guild: Guild = message.guild;

		const memberCountEmbed = this.client.embed(message.author)
			.setTitle(guild.name)
			.addField("Members", `**${guild.memberCount}**`, true)
			.addField("Humans", `**${guild.members.cache.filter(member => !member.user.bot).size}**`, true)
			.addField("Bots", `**${message.guild?.members.cache.filter(member => member.user.bot).size}**`, true)
			.addField("Member Status", stripIndents`
				**${guild.members.cache.filter(o => o.presence.status === "online").size}** Online
				**${guild.members.cache.filter(i => i.presence.status === "idle").size}** Inactive
				**${guild.members.cache.filter(dnd => dnd.presence.status === "dnd").size}** Do Not Disturb
				**${guild.members.cache.filter(off => off.presence.status === "offline").size}** Offline/ Invisible
				`);

		if(guild.iconURL()) memberCountEmbed.setThumbnail(`${guild.iconURL()}`);

		this.client.sendEmbed(message, memberCountEmbed);
	}
}