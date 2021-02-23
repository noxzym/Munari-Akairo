const { Command } = require("discord-akairo");
const { createEmbed } = require("../../Utils/CreateEmbed");
const convert = require("pretty-ms");

module.exports = class NowplayingCommand extends Command {
    constructor() {
        super("NowplayingCommand", {
            aliases: ["nowplaying", "nowplay", "np"],
            category: "Music",
            description: {
                content: "Get the current song",
                usage: "nowplaying"
            },
            cooldown: 5e3,
            channel: "guild",
            ownerOnly: false,
            editable: false,
            typing: false,
            quoted: false,
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            userPermissions: null,
        })
    }
    async exec(message) {
        const queue = message.guild.queue
        if (!queue) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Nothing are playing now")).then(x => x.delete({ timeout: 10000 }));

        const data1 = (queue.songs[0].nowplaying * 1000 - (queue.songs[0].nowplaying * 1000 - message.guild.queue.player.position)) / 1000;
        const data2 = await this.client.util.progressbar(queue.songs[0].nowplaying, data1, 15);
        const status = queue.playing ? '▶️' : '⏸️';

        const progress = Math.abs((queue.songs[0].nowplaying * 1000 - message.guild.queue.player.position) - queue.songs[0].nowplaying * 1000);

        let nowPlaying = createEmbed("info")
            .setTitle(`${queue.songs[0].title}`)
            .setURL(queue.songs[0].url)
            .setDescription(`${status} **${data2} \`[${convert(progress, { colonNotation: true, secondsDecimalDigits: 0 })}/${queue.songs[0].duration}]\` \nRequested by \`【${queue.songs[0].requester.username}】\`**`)
            .setImage(queue.songs[0].thumbnail)
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
        message.channel.send(nowPlaying);
    }
};