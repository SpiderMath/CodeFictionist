import { Client, Collection, ColorResolvable, GuildMember, Intents, Message, MessageEmbed, User } from "discord.js";
import { readdir } from "fs/promises";
import { join } from "path";
import { loadEmojis } from "../Helpers/Client/LoadEmojis";
import { loadDevs } from "../Helpers/Client/LoadDevelopers";
import { StartConfig } from "../Types/StartConfig";
import BaseCommand from "./BaseCommand";
import BaseEvent from "./BaseEvent";
import CommandManager from "./CommandManager";
import Logger from "./Logger";
import { existsSync, readFileSync } from "fs";

export default class CodeFictionistClient extends Client {
	public commands: CommandManager;
	public prefixes: string[] = [];
	public emotes = {
		success: "✅",
		error: "❌",
		loading: "🤔",
	};
	public devs: Collection<string, User> = new Collection();
	public logger = new Logger(join(__dirname, "../../Server/Logs.json"));

	constructor() {
		super({
			intents: Intents.ALL,
			allowedMentions: {
				parse: [
					"everyone",
					"roles",
					"users",
				],
			},
		});

		this.commands = new CommandManager(this);
	}

	async start(config: StartConfig) {
		config.prefixes.forEach(prefix => this.prefixes.push(prefix));
		// Loads all the events from events Directory
		await this._loadEvents(config.eventDir);
		// Loads command from the command Directory
		await this._loadCommands(config.commandDir);
		// Logs the bot in!!!!
		this.login(config.token);

		this.once("ready", () => {
			loadEmojis(this, config.emojis);
			loadDevs(this, config.devs);
		});
	}

	private async _loadCommands(commandDir: string) {
		const subDirs = await readdir(commandDir);
		const categoryMap = this.loadJSON(join(__dirname, "../../Assets/JSON/categoryMap.json"));

		for(const subDir of subDirs) {
			const files = await readdir(join(commandDir, subDir));
			this.logger.info("client/commands", `Loading subdirectory ${subDir}`);

			for(const file of files) {
				const pseudoPull = await import(join(commandDir, subDir, file));
				const pull = new pseudoPull.default(this) as BaseCommand;

				pull.category = categoryMap[subDir.toLowerCase()] || subDir;
				pull.credits.push(
					{
						name: "SpiderMath",
						reason: "Code",
						URL: "https://github.com/SpiderMath",
						reasonURL: "https://github.com/SpiderMath/CodeFictionist",
					},
					{
						name: "Dr. Time",
						reason: "Code",
						URL: "https://github.com/Rubayz",
						reasonURL: "https://github.com/SpiderMath/CodeFictionist",
					},
				);

				this.commands.register(pull.name, pull);
				pull.aliases.forEach(alias => this.commands.register(pull.name, alias));

				this.logger.success("client/commands", `Loaded command ${pull.name} 💪`);
			}
		}
	}

	private async _loadEvents(eventDir: string) {
		const files = await readdir(eventDir);

		for(const file of files) {
			const pseudoPull = await import(join(eventDir, file));
			const pull = new pseudoPull.default(this) as BaseEvent;

			this.on(pull.name, (...args: any[]) => pull.run(...args));

			this.logger.success("client/events", `Listening for event: ${pull.name} 👂`);
		}
	}

	public loadJSON(pathToJSON: string) {
		if(!existsSync(pathToJSON)) throw new Error("Invalid path provided");

		const data = readFileSync(pathToJSON);
		const parsed = JSON.parse(data.toString());

		return parsed;
	}

	public embed(author: User, colour?: ColorResolvable) {
		return new MessageEmbed()
			.setTimestamp()
			.setColor(colour || "GREEN")
			.setAuthor(author.tag, author.displayAvatarURL({ dynamic: true }));
	}

	public sendEmbed(message: Message, embed: MessageEmbed) {
		message.channel.send({ embed });
	}

	public getMember(message: Message, input: string | undefined, throwErrorOnNoResults: boolean = false, inputOutOfRangeError: boolean = false): GuildMember | null {
		let member: unknown = message.mentions.members?.first();
		const cache = message.guild?.members.cache;

		if(!member) {
			if(input) {
				if(input.length > 32) {
					if(inputOutOfRangeError) throw new Error("Input is too large");
					else return null;
				}

				input = input.split("").map(letter => {
					if(["*", "\\", "{", "}", "[", "]", "^", "$", ".", "|", "(", ")", "+"].includes(letter)) return `\\${letter}`;
					return letter;
				}).join("");

				// @ts-ignore
				member = cache?.filter(m => (m.user.id === input) || (new RegExp(input, "ig").test(m.user.tag) || (new RegExp(input, "ig").test(m.nickname || "")))).first();
			}
			if(!member && throwErrorOnNoResults && input) {
				throw new Error("Not found");
			}

			if(!member) {
				member = message.member;
			}
		}

		return member as GuildMember;
	}

	public getUser(message: Message, input: string | undefined, throwErrorOnNoResults: boolean = false, inputOutOfRangeError: boolean = false): User | null {
		let member: unknown = message.mentions.users?.first();
		const cache = this.users.cache;

		if(!member) {
			if(input) {
				if(input.length > 32) {
					if(inputOutOfRangeError) throw new Error("Input is too large");
					else return null;
				}

				input = input.split("").map(letter => {
					if(["*", "\\", "{", "}", "[", "]", "^", "$", ".", "|", "(", ")", "+"].includes(letter)) return `\\${letter}`;
					return letter;
				}).join("");

				// @ts-ignore
				member = cache?.filter(m => (m.id === input) || (new RegExp(input, "ig").test(m.tag))).first();
			}
			if(!member && throwErrorOnNoResults && input) {
				throw new Error("Not found");
			}
			if(!member) {
				member = message.member;
			}
		}

		return member as User;
	}
};