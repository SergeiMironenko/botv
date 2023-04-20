const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gif')
		.setDescription('Отправить гифку')
		.addStringOption(option =>
			option
				.setName('название_гифки')
				.setDescription('gif')
				.setRequired(true)),
	async execute(interaction) {
		let gifName = interaction.options.getString('название_гифки', true);
		let gif = new AttachmentBuilder(`./gifs/${gifName}.gif`);

		if (!fs.existsSync(gif.attachment)) {
			const randomGifNames = ['noclue', 'mark', 'vega'];
			const idx = Math.floor((Math.random() * randomGifNames.length));
			gifName = randomGifNames[idx];
			gif = new AttachmentBuilder(`./gifs/${gifName}.gif`);
		}

		const gifEmbed = new EmbedBuilder()
			.setAuthor({ name: interaction.member.user.username, iconURL: interaction.member.user.avatarURL() })
			.setColor(0xca5ad6)
			.setImage(`attachment://${gifName}.gif`)
			.setFooter({ text: gifName });
		const message = await interaction.reply({ embeds: [gifEmbed], files: [gif], fetchReply: true });
		message.react('✅');
	},
};