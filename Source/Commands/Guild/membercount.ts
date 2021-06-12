import { Message, MessageEmbed } from "discord.js";
import BaseCommand from "../../Base/BaseCommand";
import CodeFictionistClient from "../../Base/Client";

export default class MemberCount extends BaseCommand {
    constructor(client: CodeFictionistClient) {
        super(client, {
            name: "membercount",
            description: "Get's the number of member of CodeFiction",
            aliases: ["users", "members", "member-count"]
        })
    }
    async run(message: Message) {
        const embed = new MessageEmbed()
            .setTitle("**Member Count**")
            .setColor('#0099ff')
            // @ts-ignore
            .setThumbnail(message.guild?.iconURL())
            .addField('Members', `**${message.guild?.memberCount}**`, true)
            .addField('Humans', `**${message.guild?.members.cache.filter(member => !member.user.bot).size}**`, true)
            .addField('Bots', `**${message.guild?.members.cache.filter(member => member.user.bot).size}**`, true)
            .addField('Member Status', `**${message.guild?.members.cache.filter(o => o.presence.status === 'online').size}** Online\n**${message.guild?.members.cache.filter(i => i.presence.status === 'idle').size}** Inactive\n**${message.guild?.members.cache.filter(dnd => dnd.presence.status === 'dnd').size}** Do Not Disturb\n**${message.guild?.members.cache.filter(off => off.presence.status === 'offline').size}/ ${message.guild?.members.cache.filter(s => s.presence.status === 'invisible').size}** Offline/ Invisible`)
            .setFooter(`© CodeFictionist`)
                
        message.channel.send({embed: embed});
        this.client.embed(message.author)
    }
}