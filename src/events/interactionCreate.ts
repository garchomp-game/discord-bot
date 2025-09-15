import { URL } from 'node:url';
import { Events } from 'discord.js';
import { loadCommands } from '../util/loaders.js';
import type { Event } from './index.js';

const commands = await loadCommands(new URL('../commands/', import.meta.url));

export default {
	name: Events.InteractionCreate,
	async execute(interaction) {
		// v14: isChatInputCommand() が正
		if (!interaction.isChatInputCommand()) return;

		const command = commands.get(interaction.commandName);
		if (!command) {
			// 未登録コマンドは静かに通知（運用しやすさ優先）
			if (!interaction.deferred && !interaction.replied) {
				await interaction.reply({ content: 'コマンドが見つかりません。', ephemeral: true }).catch(() => {});
			}
			return;
		}

		try {
			// 重いコマンドを想定するなら既定で defer
			// if (!interaction.deferred && !interaction.replied) {
			//   await interaction.deferReply();
			// }
			await command.execute(interaction);
		} catch (error) {
			console.error(`Error executing /${interaction.commandName}:`, error);
			const msg = 'コマンド実行中にエラーが発生しました。';
			if (interaction.deferred || interaction.replied) {
				await interaction.editReply({ content: msg }).catch(() => {});
			} else {
				await interaction.reply({ content: msg, ephemeral: true }).catch(() => {});
			}
		}
	},
} satisfies Event<Events.InteractionCreate>;
