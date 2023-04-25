function sendDayPic() {
    const channel = client.channels.cache.find(channel => channel.id === '1090544337907093546');
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
            // const gifEmbed = new EmbedBuilder()
            // 	.setAuthor({ name: 'ту ту ту ру...ту ту ру ру...' })
            // 	.setColor(0xca5ad6)
            // 	.setImage(img);
            channel.send({
                files: [{ attachment: img }]
            });//embeds: [gifEmbed] });
        });
    });
}

function asdasd() {
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

    // const channel = client.channels.cache.find(channel => channel.id === '1033010362913652892');
    // channel.send({
    // 	files: [{ attachment: 'gifs/gena.gif' }, { attachment: 'gifs/gena.gif' }
    // 		, { attachment: 'gifs/gena.gif' }, { attachment: 'gifs/gena.gif' }, { attachment: 'gifs/gena.gif' }]
    // });

    setTimeout(() => {
        sendDayPic();
        setInterval(() => { sendDayPic() }, 1000 * 60 * 60 * 24);
    }, 1000)//* 60 * mRemains + 1000 * 60 * 60 * hRemains)
};

export default { asdasd };