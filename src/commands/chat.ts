import type { Command } from './index.js';
import { ChatInputCommandInteraction } from 'discord.js';

type ResponseMode = 'chat' | 'summary' | 'ideate';

interface ResponseOptions {
	mode: ResponseMode;
	content: string;
	language?: string;
}

function formatResponse({ mode, content, language = 'ja' }: ResponseOptions): string {
	const isJapanese = language === 'ja';

	switch (mode) {
		case 'chat': {
			// 通常の会話応答モード
			const lines = content.split('\n');
			if (lines.length > 10) {
				// 長い応答は見出し + 箇条書きで構造化
				return `**要点**: ${lines[0]}\n\n${lines
					.slice(1)
					.map((l) => `• ${l}`)
					.join('\n')}`;
			}
			return content;
		}

		case 'summary': {
			// サマリーモード (/matome)
			const template = isJapanese
				? [
						'**TL;DR**',
						content.slice(0, 100),
						'\n**要点**',
						'• ポイント1',
						'• ポイント2',
						'• ポイント3',
						'\n**決定事項**',
						'- 決定1',
						'- 決定2',
						'\n**次アクション**',
						'1. アクション1',
						'2. アクション2',
					]
				: [
						'**TL;DR**',
						content.slice(0, 100),
						'\n**Key Points**',
						'• Point 1',
						'• Point 2',
						'• Point 3',
						'\n**Decisions**',
						'- Decision 1',
						'- Decision 2',
						'\n**Next Actions**',
						'1. Action 1',
						'2. Action 2',
					];
			return template.join('\n');
		}

		case 'ideate': {
			// アイデア生成モード (/dasite)
			const template = isJapanese
				? [
						'**案1: タイトル**',
						'概要: 一行要約',
						'• ポイント1',
						'• ポイント2',
						'• ポイント3',
						'\n**案2: タイトル**',
						'概要: 一行要約',
						'• ポイント1',
						'• ポイント2',
						'• ポイント3',
						'\n**案3: タイトル**',
						'概要: 一行要約',
						'• ポイント1',
						'• ポイント2',
						'• ポイント3',
					]
				: [
						'**Option 1: Title**',
						'Summary: One-line overview',
						'• Point 1',
						'• Point 2',
						'• Point 3',
						'\n**Option 2: Title**',
						'Summary: One-line overview',
						'• Point 1',
						'• Point 2',
						'• Point 3',
						'\n**Option 3: Title**',
						'Summary: One-line overview',
						'• Point 1',
						'• Point 2',
						'• Point 3',
					];
			return template.join('\n');
		}
	}
}

export default {
	data: {
		name: 'chat',
		description: '会話エージェントと対話する',
		options: [
			{
				name: 'message',
				description: 'メッセージ内容',
				type: 3, // STRING
				required: true,
			},
			{
				name: 'mode',
				description: '応答モード (chat/summary/ideate)',
				type: 3, // STRING
				required: false,
				choices: [
					{ name: '通常会話', value: 'chat' },
					{ name: 'サマリー', value: 'summary' },
					{ name: 'アイデア出し', value: 'ideate' },
				],
			},
		],
	},
	async execute(interaction: ChatInputCommandInteraction) {
		const message = interaction.options.getString('message', true);
		const mode = (interaction.options.getString('mode') ?? 'chat') as ResponseMode;

		// 言語の判定 (簡易的な判定)
		const language = /[a-zA-Z]/.test(message) ? 'en' : 'ja';

		// モードに応じた応答を生成
		const response = formatResponse({
			mode,
			content: message,
			language,
		});

		// 応答メッセージを送信
		await interaction.reply({
			content: response,
		});
	},
} satisfies Command;
