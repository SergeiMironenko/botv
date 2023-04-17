// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const { EmbedBuilder } = require('discord.js');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var request = require('request');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

var parseMyAwesomeHtml = function (html) {
	const dom = new JSDOM(html);
	const img = dom.window.document
		.querySelector('.wallpaper__item')
		.querySelector('img')
		.getAttribute('src');
	return img;
};

var sendDayPic = function () {
	const channel = client.channels.cache.find(channel => channel.id === '1033010362913652892');
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
				.setAuthor({ name: 'ту ту ту ру...ту ту ру ру...' })
				.setColor(0xca5ad6)
				.setImage(img);
			channel.send({ embeds: [gifEmbed] });
		});
	});
}

client.on('ready', () => {
	const t = new Date();
	const h = t.getHours();
	const m = t.getMinutes();

	const hTarget = (10 + 7) % 24;
	const mTarget = 0;

	const tRemains = (hTarget * 60 + mTarget - (h * 60 + m) + 24 * 60) % (24 * 60);
	const hRemains = Math.floor(tRemains / 60);
	const mRemains = tRemains % 60;

	console.log(h, m);
	console.log(tRemains, hRemains, mRemains);

	setTimeout(() => {
		sendDayPic();
		setInterval(() => { sendDayPic() }, 1000 * 60 * 60 * 24);
	}, 1000 * 60 * mRemains + 1000 * 60 * 60 * hRemains)

});

// Log in to Discord with your client's token
client.login(token);
