// const got = require('got');
// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const { EmbedBuilder } = require('discord.js');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
// var request = require('request');
// const https = require('https');
// import axios, { isCancel, AxiosError } from 'axios';
const { request } = require('undici');


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

async function sendImgFromGoodfon(url, channelId, n) {
	let files = [];
	const channel = client.channels.cache.find(channel => channel.id === channelId);
	const res = await request(url);
	const body = await res.body.text();

	const dom = new JSDOM(body);
	const elements = dom.window.document
		.querySelectorAll('.wallpapers__item__wall');

	for (let i = 0; i < n; i++) {
		const url2 = elements[i]
			.querySelector('a')
			.getAttribute('href');
		const res2 = await request(url2);
		const body2 = await res2.body.text();

		const dom2 = new JSDOM(body2);
		const img = dom2.window.document
			.querySelector('.wallpaper__item')
			.querySelector('img')
			.getAttribute('src');
		files.push({ attachment: img });
	}

	channel.send({ files: files });
}

client.on('ready', () => {
	const t = new Date();
	const d = t.getDay();
	const h = t.getHours();
	const m = t.getMinutes();

	// Время для пейзажей
	const hTarget = (10 + 7) % 24;
	const mTarget = 0;
	37
	const tRemains = (hTarget * 60 + mTarget - (h * 60 + m) + 24 * 60) % (24 * 60);
	const hRemains = Math.floor(tRemains / 60);
	const mRemains = tRemains % 60;

	// Время для девушек
	const dTarget2 = 6;  // Суббота
	const hTarget2 = (9 + 7) % 24;
	const mTarget2 = 0;

	const tRemains2 = (hTarget2 * 60 + mTarget2 - (h * 60 + m) + 24 * 60) % (24 * 60);
	const dRemains2 = (d - dTarget2 + 7) % 7;
	const hRemains2 = Math.floor(tRemains2 / 60);
	const mRemains2 = tRemains2 % 60;

	// console.log(h, m);
	// console.log(tRemains, hRemains, mRemains);

	// Пейзажи раз в день
	setTimeout(() => {
		sendImgFromGoodfon('https://www.goodfon.ru/catalog/landscapes/', '1033010362913652892', 4);
		setInterval(() => { sendImgFromGoodfon() }, 1000 * 60 * 60 * 24);
	}, 1000 * 60 * mRemains + 1000 * 60 * 60 * hRemains);

	// Девушки раз в неделю
	setTimeout(() => {
		sendImgFromGoodfon('https://www.goodfon.ru/catalog/girls/', '1033010362913652892', 3);
		setInterval(() => { sendImgFromGoodfon() }, 1000 * 60 * 60 * 24 * 7);
	}, 1000 * 60 * mRemains2 + 1000 * 60 * 60 * hRemains2 + 1000 * 60 * 60 * 24 * dRemains2);
});

// Log in to Discord with your client's token
client.login(token);
