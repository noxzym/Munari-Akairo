const { Util } = require("discord.js")
const { createEmbed } = require("./CreateEmbed")
const { getTracks, getPreview } = require('spotify-url-info')
const erityt = require('erit-ytdl');
const yts = require('yt-search');
const ytdl = require("ytdl-core");

module.exports = class PlayerHandler {
    constructor(client) {
        this.client = client
    };

    async leave(message) {
        const data = message.guild.queue;
        message.guild.queue = null;
        this.client.channels.cache.get(data.voiceChannel).leave()
    }

    async stop(message) {
        const data = message.guild.queue;
        data.songs = []
        data.connection.dispatcher.end();
    };

    async setVolume(message, value) {
        const data = message.guild.queue;
        data.volume = value;
        data.connection.dispatcher.setVolume(value / 100);
    };

    async skip(message) {
        const data = message.guild.queue;
        data.connection.dispatcher.end();
    };

    async pause(message) {
        const data = message.guild.queue;
        await data.connection.dispatcher.pause(true);
        data.playing = false
    };

    async resume(message) {
        const data = message.guild.queue;
        await data.connection.dispatcher.resume(true);
        data.playing = true
    };

    async getSongs(data) {
        const videoPattern = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?=]*)?/
        const playlistPattern = /^((?:https?:)?\/\/)?((?:www|m)\.)?.*(youtu.be\/|list=)([^#\&\?]*).*/;
        const spotifyregex = /^(?:https:\/\/open\.spotify\.com\/(?:user\/[A-Za-z0-9]+\/)?|spotify:)(album|playlist|track)(?:[/:])([A-Za-z0-9]+).*$/;

        if (videoPattern.test(data)) {
            const songdata = [];
            const songInfo = await ytdl.getInfo(data);
            const infoSong = await yts(songInfo.videoDetails.title);
            let filter = [
                "video",
                "live"
            ];
            const datasong = infoSong.all.filter(x => filter.includes(x.type))[0]
            songdata.push({
                vid: true,
                title: Util.escapeMarkdown(datasong.title),
                identifier: datasong.videoId,
                author: datasong.author.name,
                duration: datasong.timestamp,
                nowplaying: datasong.seconds,
                url: datasong.url,
                thumbnail: datasong.thumbnail + "?size=4096",
            });
            return songdata
        };

        if (playlistPattern.test(data)) {
            const songdata = [];
            const dataid = data.match(playlistPattern);
            const getdata = await yts.search({ listId: dataid[4] });
            const datar = getdata.videos.slice(0, 20);
            for (let i = 0; i < datar.length; i++) {
                songdata.push({
                    ytpl: true,
                    title: Util.escapeMarkdown(datar[i].title),
                    identifier: datar[i].videoId,
                    author: datar[i].author.name,
                    duration: datar[i].duration.timestamp,
                    nowplaying: datar[i].duration.seconds,
                    url: `https://www.youtube.com/watch?v=${datar[i].videoId}`,
                    thumbnail: datar[i].thumbnail + "?size=4096",
                })
            }
            return songdata;
        };

        if (spotifyregex.test(data)) {
            const input = data.match(spotifyregex);
            if (input[1] === "track") {
                const songdata = [];
                const getdata = await getPreview(data);
                const infoSong = await yts.search(`${getdata.title} - ${getdata.artist}`);
                let filter = [
                    "video",
                    "live"
                ];
                const getzero = infoSong.all.filter(x => filter.includes(x.type))[0];
                songdata.push({
                    sp: true,
                    title: Util.escapeMarkdown(getzero.title),
                    identifier: getzero.videoId,
                    author: getzero.author.name,
                    duration: getzero.timestamp,
                    nowplaying: getzero.seconds,
                    url: getzero.url,
                    thumbnail: getzero.thumbnail + "?size=4096",
                });
                return songdata;
            } else if (input[1] === "playlist") {
                return;
                const songdata = [];
                const datar = await getTracks(data);
                const getdata = await Promise.all(datar.map(({ album }) => album).map(x => datayt(`${x.name} - ${x.artists.map(x => x.name)}`)));
                getdata.slice(0, 10).filter(x => x !== undefined).map(x => {
                    songdata.push({
                        sppl: true,
                        title: Util.escapeMarkdown(x.title),
                        identifier: x.videoId,
                        author: x.author.name,
                        duration: x.timestamp,
                        nowplaying: x.seconds,
                        url: `https://www.youtube.com/watch?v=${x.videoId}`,
                        thumbnail: x.thumbnail + "?size=4096",
                    })
                });
                return songdata;
            } else return;
            async function datayt(x) {
                const ytget = await yts.search(x);
                let filter = [
                    "video",
                    "live"
                ];
                const data = ytget.all.filter(x => filter.includes(x.type))[0];
                return data
            };
        };
    };

    async play(song, message) {
        const queue = message.guild.queue

        if (!song) {
            setTimeout(async () => {
                if (!queue.connection.dispatcher && message.guild.me.voice.channel) {
                    await this.leave(message);
                    return await this.client.channels.cache.get(queue.textChannel).send(createEmbed("info", "Request more song to keep me in the voice channel")).then(msg => { msg.delete({ timeout: 10000 }); })
                } else return;
            }, 60000);
            queue.songs = []
            return this.client.channels.cache.get(queue.textChannel).send(createEmbed("info", "Music queue ended. I'll disconnected in **\`60\`** Seconds")).then(msg => { msg.delete({ timeout: 10000 }); })
        }
        queue.connection.on("disconnect", () => message.guild.queue = null)

        let dispatcher;
        try {
            if (song.url.includes('youtube.com')) {
                dispatcher = queue.connection.play(await erityt(song.url, { filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1 << 25, bitrate: 96000 }), { type: "opus" })
            } else {
                dispatcher = queue.connection.play(song.url, { bitrate: 96000 })
            };

            dispatcher.on("finish", () => {
                if (queue.loop) {
                    let lastSong = queue.songs.shift();
                    queue.songs.push(lastSong);
                    this.play(queue.songs[0], message);
                } else {
                    queue.songs.shift();
                    this.play(queue.songs[0], message);
                }
            });

            dispatcher.on("error", (error) => {
                console.error(error);
                queue.songs.shift();
                this.play(queue.songs[0], message);
            });

            dispatcher.setVolumeLogarithmic(queue.volume / 100);

            let duras = song.duration === undefined ? '◉ LIVE' : song.duration
            let embed = createEmbed("yt")
                .setAuthor(`Youtube Client`, 'https://media.discordapp.net/attachments/743752317333143583/786185147706900490/YouTubeLogo.png?width=270&height=270')
                .setThumbnail(song.thumbnail)
                .setDescription(`**[${song.title}](${song.url})\nDuration: \`${duras}\`     Channel: \`${song.author}\`**`)
                .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
                .setTimestamp();

            let embedunk = createEmbed("listen")
                .setAuthor(`Listen.moe`, 'https://cdn.discordapp.com/attachments/743752317333143583/767745938252103690/Avatar.png')
                .setThumbnail('https://cdn.discordapp.com/attachments/743752317333143583/767745938252103690/Avatar.png')
                .setDescription(`**[${song.title}](${song.url})\nDuration: \`${duras}\`     Channel: \`${song.author}\`**`)
                .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
                .setTimestamp();

            song.url.includes("youtube.com") ? await message.client.channels.cache.get(queue.textChannel).send(embed) : await message.client.channels.cache.get(queue.textChannel).send(embedunk)

        } catch (e) {
            await message.guild.me.voice.channel.leave()
            return message.channel.send(createEmbed("error", `<a:no:765207855506522173> | Operation Canceled. I got the error: ${e.message}`))
        }
    };
}