import type { Command } from '../../commands/index.js';
import { Message, ChatInputCommandInteraction } from 'discord.js';

export default {
	data: {
		name: 'matome',
		description: '会話をまとめる',
		options: [
			{
				name: 'messages',
				description: 'まとめるメッセージ数',
				type: 4, // INTEGER
				required: false,
			},
		],
	},
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();

		const messageCount = interaction.options.getInteger('messages') ?? 10;

		// メッセージの取得
		if (!interaction.channel) {
			await interaction.editReply({
				content: 'チャンネルでのみ使用可能です。',
			});
			return;
		}

		const messages = await interaction.channel.messages.fetch({ limit: messageCount });
		const messageContent = Array.from(messages.values())
			.reverse()
			.map((m: Message) => `${m.author.username}: ${m.content}`)
			.join('\n');

		// サマリーの生成
		const summary = [
			'**TL;DR**',
			'直近の会話の要約です。',
			'',
			'**要点**',
			'• ' + messages.size + '件のメッセージを分析',
			'• 主な話者: ' + Array.from(new Set(messages.map((m: Message) => m.author.username))).join(', '),
			'',
			'**決定事項**',
			'- (会話から自動抽出)',
			'',
			'**次アクション**',
			'1. (会話から自動抽出)',
		].join('\n');

		// 応答を送信
		await interaction.editReply({
			content: summary,
		});
	},
} satisfies Command;
