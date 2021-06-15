import { GuildMember, Message } from "discord.js";
import BaseCommand from "../../Base/BaseCommand";
import CodeFictionistClient from "../../Base/Client";

export default class UserInfoCommand extends BaseCommand {
	constructor(client: CodeFictionistClient) {
		super(client, {
			name: "userinfo",
			aliases: ["ui", "user"],
			description: "Gets the information on a user",
		});
	}

	async run(message: Message, args: string[]) {
		// @ts-ignore
		const member: GuildMember = message.mentions.members?.first() || message.member;

		const userInfoEmbed = this.client.embed(message.author)
			.setTitle(member.user.tag)
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true }) || member.user.defaultAvatarURL)
			.addField("ID", member.id, true)
			.addField("Nickname", member.nickname || member.user.username, true)
			.addField("Discriminator", member.user.discriminator, true);

		this.client.sendEmbed(message, userInfoEmbed);
	}
}