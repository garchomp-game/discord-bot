import process from 'node:process';
import { URL } from 'node:url';
import { API } from '@discordjs/core/http-only';
import { REST, Routes } from 'discord.js';
import { loadCommands } from './loaders.js';

const commands = await loadCommands(new URL('../commands/', import.meta.url));
const commandData = [...commands.values()].map((command) => command.data);

const { DISCORD_TOKEN, APPLICATION_ID, GUILD_ID, COMMAND_SCOPE } = process.env;
if (!DISCORD_TOKEN || !APPLICATION_ID) {
	throw new Error('DISCORD_TOKEN と APPLICATION_ID を .env に設定してください');
}

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);
const api = new API(rest);

// 優先順位: COMMAND_SCOPE=guild or GUILD_ID がある → ギルド登録 / それ以外 → グローバル登録
if (COMMAND_SCOPE === 'guild' || GUILD_ID) {
	const result = await api.applicationCommands.bulkOverwriteGuildCommands(APPLICATION_ID, GUILD_ID!, commandData);
	console.log(`✅ Registered ${result.length} guild commands to ${GUILD_ID}`);
} else {
	const result = await api.applicationCommands.bulkOverwriteGlobalCommands(APPLICATION_ID, commandData);
	console.log(`✅ Registered ${result.length} global commands.`);
}
