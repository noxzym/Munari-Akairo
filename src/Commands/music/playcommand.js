const { Command } = require("discord-akairo");
const { createEmbed } = require("../../Utils/CreateEmbed")
const { Util } = require("discord.js");
const convert = require("pretty-ms");

module.exports = class PlayCommand extends Command {
    constructor() {
        super("PlayCommand", {
            aliases: ["play", "p"],
            category: "Music",
            description: {
                content: "Play song from youtube, spotify",
                usage: "play <song[youtube/spotify][title/url]>"
            },
            args: [
                {
                    id: "search",
                    match: "content"
                },
                {
                    id: "flags",
                    match: "flag",
                    flag: ["--search", "--find"]
                }
            ],
            cooldown: 1.5e4,
            channel: "guild",
            ownerOnly: false,
            editable: true,
            typing: false,
            quoted: false,
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "CONNECT", "SPEAK"],
            userPermissions: null,
        })
    }
    async exec(message, { search, flags }) {
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Please join voice channel first")).then(x => x.delete({ tineout: 10000 }));
        if (!search) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. No query given")).then(x => x.delete({ timeout: 10000 }));

        const queue = message.guild.queue;
        var data = await this.client.shoukaku.getSongs(search.replace("--search", "").replace("--find", ""));
        if (!data || data.tracks.length === 0) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Can't get song data")).then(x => x.delete({ timeout: 10000 }));

        var queueConstruct = {
            textChannel: message.channel.id,
            voiceChannel: channel.id,
            guildId: message.guild.id,
            songs: [],
            connection: null,
            loop: false,
            volume: 100,
            playing: true,
            messageId: null
        };

        if (data.type === "PLAYLIST") {
            const trackpl = await data.tracks.slice(0, 50);
            if (queue) {
                for (let i = 0; i < trackpl.length; i++) {
                    let skip = 0;
                    if (trackpl[i].info.isStream) {
                        skip++;
                        return message.channel.send(createEmbed("info", `**\`${skip}\`** Songs has been skipped because the song type is streaming`)).then(x => x.delete({ timeout: 10000 }));
                    }
                    queue.songs.push({
                        track: trackpl[i].track,
                        seekable: trackpl[i].info.isSeekable,
                        title: Util.escapeMarkdown(trackpl[i].info.title),
                        identifier: trackpl[i].info.identifier,
                        author: trackpl[i].info.author,
                        duration: convert(trackpl[i].info.length, { colonNotation: true }),
                        nowplaying: trackpl[i].info.length / 1000,
                        url: trackpl[i].info.uri,
                        thumbnail: `https://i.ytimg.com/vi/${trackpl[i].info.identifier}/hqdefault.jpg`,
                        requester: message.author
                    });
                }
                message.util.send(createEmbed("info", `**Playlist \`${Util.escapeMarkdown(await data.playlistName)}\` has been added to Queue**`).setThumbnail(`https://i.ytimg.com/vi/${await data.tracks[0].info.identifier}/hqdefault.jpg`));
            } else {
                for (let i = 0; i < trackpl.length; i++) {
                    let skip = 0;
                    if (trackpl[i].info.isStream) {
                        skip++;
                        return message.channel.send(createEmbed("info", `**\`${skip}\`** Songs has been skipped because the song type is streaming`)).then(x => x.delete({ timeout: 10000 }));
                    }
                    queueConstruct.songs.push({
                        track: trackpl[i].track,
                        seekable: trackpl[i].info.isSeekable,
                        title: Util.escapeMarkdown(trackpl[i].info.title),
                        identifier: trackpl[i].info.identifier,
                        author: trackpl[i].info.author,
                        duration: convert(trackpl[i].info.length, { colonNotation: true }),
                        nowplaying: trackpl[i].info.length / 1000,
                        url: trackpl[i].info.uri,
                        thumbnail: `https://i.ytimg.com/vi/${trackpl[i].info.identifier}/hqdefault.jpg`,
                        requester: message.author
                    });                   
                }
                message.util.send(createEmbed("info", `**Playlist \`${Util.escapeMarkdown(await data.playlistName)}\` has been added to Queue**`).setThumbnail(`https://i.ytimg.com/vi/${await data.tracks[0].info.identifier}/hqdefault.jpg`));
            }
        } else {
            var song;
            try {
                if (flags) {
                    let i = 1;
                    const map = await data.tracks.slice(0, 5).map((x) => `**${i++} • [\`${x.info.title}\`](${x.info.uri}) \`[${convert(x.info.length, { colonNotation: true })}]\`**`);
                    let e = createEmbed("info")
                        .setTitle(`Music Service Searching Song`)
                        .setDescription(map)
                        .setFooter(`Type 'cancel' to cancel the song request`)
                    var embedsearch = await message.util.send(e);
                    try {
                        var response = await message.channel.awaitMessages(
                            message2 => /^(?:[1-4]|5|cancel|c)$/g.test(message2.content.toLowerCase()) && message2.author.id === message.author.id, {
                            max: 1,
                            time: 30000,
                            errors: ["time"]
                        }
                        );
                        const input = response.first().content.substr(0, 6).toLowerCase()
                        if (input === 'cancel' || input === 'c') {
                            message.util.edit(createEmbed("error", `<a:no:765207855506522173> | Request canceled`))
                            return embedsearch.delete({ timeout: 10000 })
                        }
                        embedsearch.delete()
                        const videoIndex = parseInt(response.first().content);
                        var video = await data.tracks[videoIndex - 1];
                    } catch (e) {
                        console.log(e)
                        return message.channel.send(createEmbed("error", "The request has been canceled because no respond!")).then(x => x.delete({ timeout: 10000 }));
                    }
                    if (video.info.isStream) return message.channel.send(createEmbed("info", `Cannot playing this song because the song type is streaming`)).then(x => x.delete({ timeout: 10000 }));
                    song = {
                        track: video.track,
                        seekable: video.info.isSeekable,
                        title: Util.escapeMarkdown(video.info.title),
                        identifier: video.info.identifier,
                        author: video.info.author,
                        duration: convert(video.info.length, { colonNotation: true }),
                        nowplaying: video.info.length / 1000,
                        url: video.info.uri,
                        thumbnail: `https://i.ytimg.com/vi/${video.info.identifier}/hqdefault.jpg`,
                        requester: message.author
                    };
                } else {
                    try {
                        const track = data.tracks.shift();
                        if (track.info.isStream) return message.channel.send(createEmbed("info", `Cannot playing this song because the song type is streaming`)).then(x => x.delete({ timeout: 10000 }));
                        song = {
                            track: track.track,
                            seekable: track.info.isSeekable,
                            title: Util.escapeMarkdown(track.info.title),
                            identifier: track.info.identifier,
                            author: track.info.author,
                            duration: convert(track.info.length, { colonNotation: true }),
                            nowplaying: track.info.length / 1000,
                            url: track.info.uri,
                            thumbnail: `https://i.ytimg.com/vi/${track.info.identifier}/hqdefault.jpg`,
                            requester: message.author
                        };
                    } catch (e) {
                        console.log(e)
                        return message.channel.send(createEmbed("error", "The request has been canceled because no respond!")).then(x => x.delete({ timeout: 10000 }));
                    }
                }

                if (queue ? queue.songs.length !== 0 && queue.songs.map(x => x.identifier).filter(x => song.identifier.includes(x)).map(x => x === song.identifier).join() === 'true' : undefined) {
                    return message.channel.send(createEmbed("error", `🚫 | Sorry, this song is already in the queue.`)).then(msg => { msg.delete({ timeout: 10000 }); });
                }

                if (queue) {
                    queue.songs.push(song);
                    return message.util.send(createEmbed("info", `✅ **\`${song.title}\`** by **\`${message.author.username}\`** Has been added to queue!`))
                } else {
                    message.util.send(createEmbed("info", `✅ **\`${song.title}\`** by **\`${message.author.username}\`** Has been added to queue!`))
                    queueConstruct.songs.push(song);
                }

            } catch (e) {
                message.channel.send(createEmbed("error", `<a:no:765207855506522173> | Operation Canceled. Cannot got song data`)).then(msg => { msg.delete({ timeout: 8000 }); });
            }
        }

        if (!queue) {
            try {
                message.guild.queue = queueConstruct;
                const node = await this.client.shoukaku.manager.getNode();
                const player = await node.joinVoiceChannel({ deaf: true, guildID: message.guild.id, voiceChannelID: message.member.voice.channel.id });
                queueConstruct.player = await player;
                await this.client.shoukaku.play(queueConstruct.songs[0], message)
            } catch (e) {
                console.log(e);
                message.guild.queue = null;
                message.guild.me.voice.channel.leave();
                message.channel.send(createEmbed("error", `Operation Canceled. Because: ${e.message}`))
            }
        }
    }
};