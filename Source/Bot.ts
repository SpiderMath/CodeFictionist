// Configuration stuff
import { config } from "dotenv";
import { join } from "path";
config();

import CodeFictionistClient from "./Base/Client";

new CodeFictionistClient()
	.start({
		token: process.env.token,
		commandDir: join(__dirname, "Commands"),
		eventDir: join(__dirname, "Events"),
	});