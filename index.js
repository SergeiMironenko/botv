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

async function sendImgFromWallsCloud(url, channelId, n) {
	let files = [];
	const channel = client.channels.cache.find(channel => channel.id === channelId);
	const res = await request(url);
	const body = await res.body.text();

	const dom = new JSDOM(body);
	const elements = dom.window.document
		.querySelectorAll('.item');

	for (let i = 0; i < n; i++) {
		const url2 = elements[i]
			.querySelector('a')
			.getAttribute('href');
		const res2 = await request(url2);
		const body2 = await res2.body.text();

		const dom2 = new JSDOM(body2);
		const img = dom2.window.document
			.querySelector('.wallpaper-preview')
			.querySelector('img')
			.getAttribute('src');
		files.push({ attachment: img });
	}

	channel.send({ files: files });
}

client.on('ready', () => {
	const t = new Date();
	const d = t.getUTCDay();
	const h = t.getUTCHours();
	const m = t.getUTCMinutes();
	const s = t.getUTCSeconds();

	// Время для пейзажей
	const hTarget = (10 + 0) % 24;
	const mTarget = 0;
	const tRemains = (hTarget * 60 + mTarget - (h * 60 + m) + 24 * 60) % (24 * 60);
	const hRemains = Math.floor(tRemains / 60);
	const mRemains = tRemains % 60;

	// Время для девушек
	const dTarget2 = 6;  // Суббота
	const hTarget2 = (20 + 0) % 24;
	const mTarget2 = 10;

	const tRemains2 = (hTarget2 * 60 + mTarget2 - (h * 60 + m) + 24 * 60) % (24 * 60);
	const dRemains2 = (d - dTarget2 + 7) % 7;
	const hRemains2 = Math.floor(tRemains2 / 60);
	const mRemains2 = tRemains2 % 60;

	// Время для пейзажей 2
	const hTarget3 = (21 + 0) % 24;
	const mTarget3 = 0;
	const tRemains3 = (hTarget3 * 60 + mTarget3 - (h * 60 + m) + 24 * 60) % (24 * 60);
	const hRemains3 = Math.floor(tRemains3 / 60);
	const mRemains3 = tRemains3 % 60;

	// Космос
	const hTarget4 = (22 + 0) % 24;
	const mTarget4 = 25;
	const tRemains4 = (hTarget4 * 60 + mTarget4 - (h * 60 + m) + 24 * 60) % (24 * 60);
	const hRemains4 = Math.floor(tRemains4 / 60);
	const mRemains4 = tRemains4 % 60;

	console.log(hRemains4, mRemains4);

	// 1033010362913652892 - главный канал
	// 1090544337907093546 - тестовый канал
	const mainChannel = true;
	const id = mainChannel ? '1033010362913652892' : '1090544337907093546';

	// Пейзажи раз в день
	setTimeout(() => {
		sendImgFromGoodfon('https://www.goodfon.ru/catalog/landscapes/', id, 4);
		setInterval(() => { sendImgFromGoodfon('https://www.goodfon.ru/catalog/landscapes/', id, 4) }, 1000 * 60 * 60 * 24);
	}, 1000 * 60 * mRemains + 1000 * 60 * 60 * hRemains);

	// // Девушки два раза в неделю
	setTimeout(() => {
		if (d == 6 || d == 0) sendImgFromGoodfon('https://www.goodfon.ru/catalog/girls/', id, 3);
		setInterval(() => { if (d == 6 || d == 0) sendImgFromGoodfon('https://www.goodfon.ru/catalog/girls/', id, 3) }, 1000 * 60 * 60 * 24);
	}, 1000 * 60 * mRemains2 + 1000 * 60 * 60 * hRemains2);

	// Пейзажи с другого сайта
	// setTimeout(() => {
	// 	if (d == 1 || d == 5) sendImgFromWallsCloud('https://wallscloud.net/ru/category/nature', id, 1);
	// 	setInterval(() => { if (d == 2 || d == 5) sendImgFromWallsCloud('https://wallscloud.net/ru/category/nature', id, 6) }, 1000 * 60 * 60 * 24);
	// }, 1000 * 60 * mRemains3 + 1000 * 60 * 60 * hRemains3);

	// Космос
	// setTimeout(() => {
	// 	sendImgFromWallsCloud('https://wallscloud.net/ru/category/space/', id, 3);
	// 	setInterval(() => { sendImgFromWallsCloud('https://wallscloud.net/ru/category/space/', id, 3) }, 1000 * 60 * 60 * 24);
	// }, 1000 * 60 * mRemains4 + 1000 * 60 * 60 * hRemains4);
});

// Log in to Discord with your client's token
client.login(token);
