const { LavasfyClient } = require("lavasfy");
const { Shoukaku } = require('shoukaku');
const { getPreview } = require('spotify-url-info');
const { createEmbed } = require("./CreateEmbed");

const MuriNode = { name: "MuriNode", host: "MuriNode.orchitiadi.repl.co", secure: true, port: 443, auth: 'youshallnotpass', group: "MainNode" };
const MuriNode2 = { name: "MuriNode2", host: "MuriNode2.orchitiadi.repl.co", secure: true, port: 443, auth: 'youshallnotpass', group: "SecondNode" };
const MuriNode3 = { name: "MuriNode3", host: "MuriNode3.orchitiadi.repl.co", secure: true, port: 443, auth: 'youshallnotpass', group: "BackupNode" }
const LavalinkServer = [MuriNode, MuriNode2, MuriNode3];
const ShoukakuOptions = { moveOnDisconnect: true, resumable: true, userAgent: "Munari Rose#6371 V2.0.0", resumableTimeout: 15000, reconnectTries: 2, restTimeout: 10000 };

const filter = {
    reset: {

    },
    bass: {
        equalizer: [
            { band: 0, gain: 0.6 },
            { band: 1, gain: 0.67 },
            { band: 2, gain: 0.67 },
            { band: 3, gain: 0 },
            { band: 4, gain: -0.5 },
            { band: 5, gain: 0.15 },
            { band: 6, gain: -0.45 },
            { band: 7, gain: 0.23 },
            { band: 8, gain: 0.35 },
            { band: 9, gain: 0.45 },
            { band: 10, gain: 0.55 },
            { band: 11, gain: 0.6 },
            { band: 12, gain: 0.55 },
            { band: 13, gain: 0 },
        ],
    },
    bassboost: {
        equalizer: Array(6).fill(0).map((n, i) => ({ band: i, gain: 3 / 10 })),
    },
    earrape: {
        equalizer: Array(14).fill(0).map((n, i) => ({ band: i, gain: 3 })),
    },
    pop: {
        equalizer: [
            { band: 0, gain: 0.65 },
            { band: 1, gain: 0.45 },
            { band: 2, gain: -0.45 },
            { band: 3, gain: -0.65 },
            { band: 4, gain: -0.35 },
            { band: 5, gain: 0.45 },
            { band: 6, gain: 0.55 },
            { band: 7, gain: 0.6 },
            { band: 8, gain: 0.6 },
            { band: 9, gain: 0.6 },
            { band: 10, gain: 0 },
            { band: 11, gain: 0 },
            { band: 12, gain: 0 },
            { band: 13, gain: 0 },
        ],
    },
    soft: {
        equalizer: [
            { band: 0, gain: 0 },
            { band: 1, gain: 0 },
            { band: 2, gain: 0 },
            { band: 3, gain: 0 },
            { band: 4, gain: 0 },
            { band: 5, gain: 0 },
            { band: 6, gain: 0 },
            { band: 7, gain: 0 },
            { band: 8, gain: -0.25 },
            { band: 9, gain: -0.25 },
            { band: 10, gain: -0.25 },
            { band: 11, gain: -0.25 },
            { band: 12, gain: -0.25 },
            { band: 13, gain: -0.25 },
        ],
    },
    treblebass: {
        equalizer: [
            { band: 0, gain: 0.6 },
            { band: 1, gain: 0.67 },
            { band: 2, gain: 0.67 },
            { band: 3, gain: 0 },
            { band: 4, gain: -0.5 },
            { band: 5, gain: 0.15 },
            { band: 6, gain: -0.45 },
            { band: 7, gain: 0.23 },
            { band: 8, gain: 0.35 },
            { band: 9, gain: 0.45 },
            { band: 10, gain: 0.55 },
            { band: 11, gain: 0.6 },
            { band: 12, gain: 0.55 },
            { band: 13, gain: 0 },
        ],
    },
    nightcore: {
        equalizer: [
            { band: 1, gain: 0.3 },
            { band: 0, gain: 0.3 },
        ],
        timescale: { pitch: 1.2 },
        tremolo: { depth: 0.3, frequency: 14 },
    },
    vaporwave: {
        equalizer: [
            { band: 1, gain: 0.3 },
            { band: 0, gain: 0.3 },
        ],
        timescale: { pitch: 0.5 },
        tremolo: { depth: 0.3, frequency: 14 },
    },
};

module.exports = class ShoukakuHandler {
    constructor(client) {
        this.client = client;
        this.manager = new Shoukaku(client, LavalinkServer, ShoukakuOptions);
    }
    async repeat(message) {
        message.guild.queue.loop = !message.guild.queue.loop;
    }
    async skip(message) {
        message.guild.queue.player.stopTrack();
    }
    async stop(message) {
        this.client.channels.cache.get(message.guild.queue.textChannel).messages.fetch(message.guild.queue.messageId).then(x => x.delete());
        message.guild.queue.player.stopTrack();
        message.guild.queue.player.disconnect();
        message.guild.queue = null;
    }
    async leave(message) {
        message.guild.queue.player.disconnect();
        message.guild.queue = null;
    }
    async pause(message) {
        message.guild.queue.player.setPaused(true);
        message.guild.queue.playing = false;
    }
    async resume(message) {
        message.guild.queue.player.setPaused(false);
        message.guild.queue.playing = true;
    }
    async setVolume(message, volume) {
        message.guild.queue.player.setVolume(volume/100);
        message.guild.queue.volume = volume;
    }
    async setFilter(message, changer) {
        const delay = ms => new Promise(res => setTimeout(res, ms));
        const player = message.guild.queue.player;

        switch (changer) {

            case "reset":
                player.setGroupedFilters(filter.reset)
                break;
            case "bass":
                player.setGroupedFilters(filter.bass)
                break;
            case "bassboost":
                player.setGroupedFilters(filter.bassboost)
                break;
            case "earrape":
                player.setGroupedFilters(filter.earrape)
                break;
            case "pop":
                player.setGroupedFilters(filter.pop)
                break;
            case "soft":
                player.setGroupedFilters(filter.soft)
                break;
            case "treblebass":
                player.setGroupedFilters(filter.treblebass)
                break;
            case "nightcore":
                player.setGroupedFilters(filter.nightcore)
                break;
            case "vaporwave":
                player.setGroupedFilters(filter.vaporwave)
                break;
        
            default:
                break;
        }

        var data = await message.channel.send(`Please Wai`);
        await delay(7000);
        return data.edit(`Successful!`)
    }
    async getSongs(query, option) {
        const youtuberegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
        const spotifyregex = /^(?:https:\/\/open\.spotify\.com\/(?:user\/[A-Za-z0-9]+\/)?|spotify:)(album|playlist|track)(?:[/:])([A-Za-z0-9]+).*$/;
        const soundcloudregex = /^https?:\/\/(soundcloud.com|snd.sc)\/(.*)$/;

        var lavasfy = new LavasfyClient({ clientID: this.client.config.spcid, clientSecret: this.client.config.spcs, filterAudioOnlyResult: false }, this.client.config.nodes);
        var node = this.manager.getNode();

        if (youtuberegex.test(query)) {
            const load = await node.rest.resolve(query);
            return load;
        } else if (spotifyregex.test(query)) {
            await lavasfy.requestToken();
            const load = lavasfy.nodes.get(this.manager.getNode().name).load(query);
            return load;
        } else if (soundcloudregex.test(query)) {
            const load = await node.rest.resolve(query, "soundcloud");
            return load;
        } else if (option === "spotify") {
            if (spotifyregex.test(query)) {
                await lavasfy.requestToken();
                const node = lavasfy.nodes.get(this.manager.getNode().name);
                const load = await node.load(query);
                return load;
            } else {
                const data = await getPreview(query);
                await lavasfy.requestToken();
                const node = lavasfy.nodes.get(this.manager.getNode().name);
                const load = await node.load(data.link);
                return load;
            }
        } else if (option === undefined) {
            let load = await node.rest.resolve(query, "youtube");
            if (!load) load = await node.rest.resolve(query, "youtubemusic");
            return load
        } else {
            const load = await node.rest.resolve(query, option);
            return load;
        }
    }

    async play(track, message) {
        try {
            message.guild.queue.player.playTrack(track.track, { noReplace: true });
            message.guild.queue.player.on("start", async () => {
                let e = createEmbed("info")
                    .setAuthor(`${this.client.user.username} • Playing`, this.client.user.avatarURL({ dynamic: true, size: 4096, format: "png" }))
                    .setDescription(`**\`[${message.guild.queue.songs[0].title}]\`\nDuration: \`${message.guild.queue.songs[0].duration}\`**`)
                    .setThumbnail(message.guild.queue.songs[0].thumbnail)
                    .setTimestamp()
                    .setFooter(`Requested by ${message.guild.queue.songs[0].requester.username}`)
                this.client.channels.cache.get(message.guild.queue.textChannel).send(e).then((x) => {
                  message.guild.queue.messageId = x.id
                })
            });
            message.guild.queue.player.on("end", async () => {
                this.client.channels.cache.get(message.guild.queue.textChannel).messages.fetch(message.guild.queue.messageId).then(x => x.delete());
                let songtopush = await message.guild.queue.songs.shift();
                if (message.guild.queue.loop) {
                    message.guild.queue.songs.push(songtopush);
                    message.guild.queue.player.playTrack(message.guild.queue.songs[0].track, { noReplace: true });
                } else if (message.guild.queue.songs.length === 0) {
                    await this.client.channels.cache.get(message.guild.queue.textChannel).send(createEmbed("info", "**Request more song to keep me in the voice channel**")).then(msg => { msg.delete({ timeout: 10000 }); })
                    return this.leave(message);
                } else {
                    message.guild.queue.player.playTrack(message.guild.queue.songs[0].track, { noReplace: true });
                }
            });
            message.guild.queue.player.on("closed", () => {
                this.client.channels.cache.get(message.guild.queue.textChannel).messages.fetch(message.guild.queue.messageId).then(x => x.delete());
                this.leave(message);
            });
            message.guild.queue.player.on("error", () => {
                this.client.channels.cache.get(message.guild.queue.textChannel).messages.fetch(message.guild.queue.messageId).then(x => x.delete());
                this.leave(message);
            });
            message.guild.queue.player.on("nodeDisconnect", () => {
                /*this.client.channels.cache.get(message.guild.queue.textChannel).messages.fetch(message.guild.queue.messageId).then(x => x.delete());
                this.leave(message);*/
            });
        } catch (e) {
            console.log(e);
            this.client.channels.cache.get(message.guild.queue.textChannel).messages.fetch(message.guild.queue.messageId).then(x => x.delete());
            message.guild.queue.player.disconnect()
            message.guild.queue = null;
        }
    }
}