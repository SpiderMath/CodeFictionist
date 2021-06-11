import { Client, Collection, Intents, User } from "discord.js";
import { readdir } from "fs/promises";
import { join } from "path";
import { loadEmojis } from "../Helpers/Client/LoadEmojis";
import { loadDevs } from "../Helpers/Client/LoadDevelopers";
import { StartConfig } from "../Types/StartConfig";
import BaseCommand from "./BaseCommand";
import BaseEvent from "./BaseEvent";
import CommandManager from "./CommandManager";
import Logger from "./Logger";

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

		for(const subDir of subDirs) {
			const files = await readdir(join(commandDir, subDir));
			this.logger.info("client/commands", `Loading subdirectory ${subDir}`);

			for(const file of files) {
				const pseudoPull = await import(join(commandDir, subDir, file));
				const pull = new pseudoPull.default(this) as BaseCommand;

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
};