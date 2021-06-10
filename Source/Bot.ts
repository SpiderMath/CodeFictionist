// Configuration stuff
import { config } from "dotenv";
import { join } from "path";
config();

import ErisClient from "./Base/Client";

new ErisClient()
	.start({
		token: process.env.token,
		commandDir: join(__dirname, "Commands"),
		eventDir: join(__dirname, "Events"),
	});