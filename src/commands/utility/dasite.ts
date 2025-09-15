import type { Command } from '../../commands/index.js';
import { ChatInputCommandInteraction } from 'discord.js';

export default {
	data: {
		name: 'dasite',
		description: 'アイデアを出す',
		options: [
			{
				name: 'theme',
				description: 'アイデアを出すお題',
				type: 3, // STRING
				required: true,
			},
		],
	},
	async execute(interaction: ChatInputCommandInteraction) {
		const theme = interaction.options.getString('theme', true);

		// アイデア生成のテンプレート
		const ideas = [
			{
				title: '保守的アプローチ',
				summary: '既存の手法を改善',
				points: ['現状の課題を特定', '段階的な改善案を提示', '実現可能性を重視'],
			},
			{
				title: '革新的アプローチ',
				summary: '新しい視点からの解決',
				points: ['従来の常識を見直し', 'テクノロジーを活用', '大胆な発想を重視'],
			},
			{
				title: '折衷案',
				summary: '両者のメリットを組み合わせ',
				points: ['実現可能性と革新性のバランス', '段階的な導入計画', 'リスク管理を考慮'],
			},
		];

		// フォーマットされた応答を生成
		const response = [
			`お題: ${theme}\n`,
			...ideas.map((idea) =>
				[`**案: ${idea.title}**`, `概要: ${idea.summary}`, ...idea.points.map((point) => `• ${point}`), ''].join('\n'),
			),
		].join('\n');

		// 応答を送信
		await interaction.reply({
			content: response,
		});
	},
} satisfies Command;
