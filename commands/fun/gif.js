const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gif')
		.setDescription('Send gif')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('The input to echo back')),
	async execute(interaction) {
		await interaction.reply('gif !');
	},
};