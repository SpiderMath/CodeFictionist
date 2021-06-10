interface StartConfig {
	token: string | undefined,
	commandDir: string,
	eventDir: string,
	prefixes: string[],
	emojis?: {
		success?: string,
		loading?: string,
		error?: string,
	},
	developers: `${bigint}`[],
};

export { StartConfig };