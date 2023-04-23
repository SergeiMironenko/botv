const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { request } = require('undici');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('weather')
        .addStringOption(option =>
            option
                .setName('город')
                .setDescription('city')
                .setRequired(true)),
    async execute(interaction) {
        const city = interaction.options.getString('город', true);
        const url = 'http://api.weatherapi.com/v1/current.json?key=cb3448035a5c47d6baa141119222712&q=' + city + '&aqi=no';
        const r = await request(url);
        let data = 'Города ' + city + ' не найдено.';
        let gifName = 'weather';
        if (r.statusCode === 200) {
            data = 'В городе ' + city + ' ' + (await r.body.json()).current.temp_c + ' C';
        }
        else {
            gifName = 'weather_not_found';
        }
        const gif = new AttachmentBuilder(`./gifs/${gifName}.gif`);
        const gifEmbed = new EmbedBuilder()
            .setURL("https://www.google.com/")
            .setAuthor({ name: interaction.member.user.username, iconURL: interaction.member.user.avatarURL() })
            .setColor(0xca5ad6)
            .setImage(`attachment://${gifName}.gif`)
            .setFooter({ text: data });
        const message = await interaction.reply({ embeds: [gifEmbed], files: [gif], fetchReply: true });
        message.react('☀️');
    }
}