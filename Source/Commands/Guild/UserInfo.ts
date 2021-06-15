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
		let member: GuildMember;

		try {
			// @ts-ignore
			member = this.client.getMember(message, args.join(" "), true, true);
		}
		catch(err) {
			return message.channel.send(`${this.client.emotes.error} user ${err.message}`);
		}

		const userInfoEmbed = this.client.embed(message.author)
			.setTitle(member.user.tag)
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true }) || member.user.defaultAvatarURL)
			.addField("ID", member.id, true)
			.addField("Nickname", member.nickname || member.user.username, true)
			.addField("Discriminator", member.user.discriminator, true)
			.addField("Roles", member.roles.cache.filter(role => role.name !== "everyone").array().map(role => `<@&${role.id}>`).join(""));

		this.client.sendEmbed(message, userInfoEmbed);
	}
}