import process from 'node:process';
import { URL } from 'node:url';
import { REST, Routes } from 'discord.js';
import { loadCommands } from './loaders.js';

const commands = await loadCommands(new URL('../commands/', import.meta.url));
const commandData = [...commands.values()].map((command) => command.data as any);

const { DISCORD_TOKEN, APPLICATION_ID, GUILD_ID, COMMAND_SCOPE } = process.env;
if (!DISCORD_TOKEN || !APPLICATION_ID) {
	throw new Error('DISCORD_TOKEN と APPLICATION_ID を .env に設定してください');
}

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

// 優先: COMMAND_SCOPE=guild → GUILD_ID 必須 / GUILD_ID がある → ギルド登録 / それ以外 → グローバル登録
if (COMMAND_SCOPE === 'guild') {
	if (!GUILD_ID) {
		throw new Error('COMMAND_SCOPE=guild の場合は GUILD_ID を .env に設定してください');
	}
	const result = (await rest.put(Routes.applicationGuildCommands(APPLICATION_ID, GUILD_ID), {
		body: commandData,
	})) as any[];
	console.log(`✅ Registered ${result.length} guild commands to ${GUILD_ID}`);
} else if (GUILD_ID) {
	const result = (await rest.put(Routes.applicationGuildCommands(APPLICATION_ID, GUILD_ID), {
		body: commandData,
	})) as any[];
	console.log(`✅ Registered ${result.length} guild commands to ${GUILD_ID}`);
} else {
	const result = (await rest.put(Routes.applicationCommands(APPLICATION_ID), {
		body: commandData,
	})) as any[];
	console.log(`✅ Registered ${result.length} global commands.`);
}
