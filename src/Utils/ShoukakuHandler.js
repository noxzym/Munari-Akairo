const { LavasfyClient } = require("lavasfy");
const { Shoukaku } = require('shoukaku');
const { getPreview } = require('spotify-url-info');
const { createEmbed } = require("./CreateEmbed");

const MuriNode = { name: "MuriNode", host: "MuriNode.orchitiadi.repl.co", secure: true, port: 443, auth: 'murinode', group: "MainNode" };
const MuriNode2 = { name: "MuriNode2", host: "MuriNode2.orchitiadi.repl.co", secure: true, port: 443, auth: 'murinode2', group: "SecondNode" };
const MuriNode3 = { name: "MuriNode3", host: "MuriNode3.orchitiadi.repl.co", secure: true, port: 443, auth: 'murinode3', group: "BackupNode" };
const KagChi = { name: "KagChiNode", host: "eu2.bombhost.cloud", secure: false, port: 20871, auth: "youshallnotpass", group: "minjem" }
const LavalinkServer = [MuriNode, MuriNode2, MuriNode3, KagChi];
const ShoukakuOptions = { moveOnDisconnect: true, resumable: true, userAgent: "Munari Rose#6371 V2.0.0", resumableTimeout: 15000, reconnectTries: 2, restTimeout: 10000 };

const filter = {
    bass: [
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
    bassboost: Array(4).fill(null).map((_, i) => ({ band: i, gain: .25 })),
    pop: [
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
    soft: [
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
    treblebass: [
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
    tremolo: { frequency: 2.0, depth: 0.5 },
    nightcore: { pitch: 1.3, speed: 1.2 },
    vibrato: { frequency: 2.0, depth: 0.5 },
    vaporwave: { pitch: 0.5 },
    eightd: { rotationHz: 0.2 }
};

module.exports = class ShoukakuHandler {
    constructor(client) {
        this.client = client;
        this.manager = new Shoukaku(client, LavalinkServer, ShoukakuOptions);
    }
    async setFilter(message, changer) {
        switch (changer) {
            case "clear":
                message.guild.queue.player.clearFilters()
                break;
            case "bass":
                message.guild.queue.player.setEqualizer(filter.bass)
                break;
            case "bassboost":
                message.guild.queue.player.setEqualizer(filter.bassboost)
                break;
            case "pop":
                message.guild.queue.player.setEqualizer(filter.pop)
                break;
            case "soft":
                message.guild.queue.player.setEqualizer(filter.soft)
                break;
            case "treblebass":
                message.guild.queue.player.setEqualizer(filter.treblebass)
                break;
            case "nightcore":
                message.guild.queue.player.setTimescale(filter.nightcore)
                break;
            case "vaporwave":
                message.guild.queue.player.setTimescale(filter.vaporwave)
                break;
            case "tremolo":
                message.guild.player.setRotation(filter.tremolo)
                break;
            case "vibrato":
                message.guild.player.setRotation(filter.vibrato)
                break;
            case "8d":
                message.guild.player.setRotation(filter.eightd)
                break;
            default:
                break;
        }
    }
    async repeat(message) {
        message.guild.queue.loop = !message.guild.queue.loop;
    }
    async skip(message) {
        message.guild.queue.player.stopTrack();
    }
    async stop(message) {
        this.client.channels.cache.get(message.guild.queue.textChannel).messages.fetch(message.guild.queue.messageId, false, true).then(x => x.delete());
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
        message.guild.queue.plasying = true;
    }
    async setVolume(message, volume) {
        message.guild.queue.player.setVolume(volume / 100);
        message.guild.queue.volume = volume;
    }
    async getSongs(query, option) {
        const youtuberegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
        const spotifyregex = /^(?:https:\/\/open\.spotify\.com\/(?:user\/[A-Za-z0-9]+\/)?|spotify:)(album|playlist|track)(?:[/:])([A-Za-z0-9]+).*$/;

        const scregex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
        const scmregex = /^(https?:\/\/)?(www.)?(m\.)?soundcloud\.com\/[\w\-\.]+(\/)+[\w\-\.]+?$/;
        const scm2regex = /^https?:\/\/(soundcloud\.app\.goo\.gl)\/(.*)$/;

        var lavasfy = new LavasfyClient({ clientID: this.client.config.spcid, clientSecret: this.client.config.spcs, filterAudioOnlyResult: false }, LavalinkServer);
        var node = this.manager.getNode();

        if (youtuberegex.test(query) || (scregex.test(query) || scmregex.test(query) || scm2regex.test(query))) {
            const load = await node.rest.resolve(query);
            return load;
        } else if (spotifyregex.test(query)) {
            await lavasfy.requestToken();
            const load = lavasfy.nodes.get(this.manager.getNode().name).load(query);
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
                this.client.channels.cache.get(message.guild.queue.textChannel).messages.fetch(message.guild.queue.messageId, false, true).then(x => x.delete());
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
                this.client.channels.cache.get(message.guild.queue.textChannel).messages.fetch(message.guild.queue.messageId, false, true).then(x => x.delete());
                this.leave(message);
            });
            message.guild.queue.player.on("error", () => {
                this.client.channels.cache.get(message.guild.queue.textChannel).messages.fetch(message.guild.queue.messageId, false, true).then(x => x.delete());
                this.leave(message);
            });
        } catch (e) {
            console.log(e);
            this.client.channels.cache.get(message.guild.queue.textChannel).messages.fetch(message.guild.queue.messageId, false, true).then(x => x.delete());
            message.guild.queue.player.disconnect()
            message.guild.queue = null;
        }
    }
}