const { EmbedBuilder } = require('discord.js');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var request = require('request');

var parseMyAwesomeHtml = function (html) {
    const dom = new JSDOM(html);
    const img = dom.window.document
        .querySelector('.wallpaper__item')
        .querySelector('img')
        .getAttribute('src');
    return img;
};

function getImg() {
    const url = 'https://www.goodfon.ru/catalog/landscapes/';
    request(url, function (err, res, body) {
        if (err) throw err;

        const dom = new JSDOM(body);
        const url2 = dom.window.document
            .querySelector('.wallpapers__item__wall')
            .querySelector('a')
            .getAttribute('href');
        console.log(url2);

        request(url2, async function (err, res, body) {
            if (err) throw err;

            const img = parseMyAwesomeHtml(body);
            const gifEmbed = new EmbedBuilder()
                .setAuthor({ name: interaction.member.user.username, iconURL: interaction.member.user.avatarURL() })
                .setColor(0xca5ad6)
                .setImage(img);
            return gifEmbed;
        });
    });
}
