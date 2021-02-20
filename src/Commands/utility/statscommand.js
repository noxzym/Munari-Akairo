const { Command } = require("discord-akairo");
const { version } = require("discord.js");
const { createEmbed } = require("../../Utils/CreateEmbed")
const os = require('os');
const cpuStat = require("cpu-stat");
const formatMs = require("pretty-ms");

module.exports = class StatsCommand extends Command {
    constructor() {
        super("StatsCommand", {
            aliases: ["stats"],
            category: "Utility",
            description: {
                content: "Display bot Statistics",
                usage: "stats"
            },
            args: [
                {
                    id: "lavalink",
                    match: "flag",
                    flag: "lavalink"
                }
            ],
            cooldown: null,
            channel: "guild",
            ownerOnly: false,
            editable: false,
            typing: true,
            quoted: false,
            clientPermissions: null,
            userPermissions: null,
        })
    };
    async exec(message, { lavalink }) {
        if (lavalink) {
            let array = [];
            await this.client.shoukaku.manager.nodes.forEach(async (x) => {
                return array.push({
                    node: x.name,
                    state: x.state,
                    core: x.stats.cpu.cores,
                    uptime: formatMs(x.stats.uptime, { secondsDecimalDigits: 0, compact: false }),
                    memoryUsage: x.stats.memory.used,
                    players: `${x.stats.playingPlayers} playing of ${x.stats.players} players`
                });
            })
            let page = 0;
            let embeds = await geneembed(message, array, this.client);
            return await message.channel.send(embeds[page]);
        };

        await cpuStat.usagePercent(async (err, percent) => {
            if (err) throw err;

            let systemembed = createEmbed("info")
                .setAuthor("Munari Rose Statistics", this.client.user.avatarURL({ dynamic: true, size: 4096, format: "png" }))
                .addField(
                    "__STATISTICS__",
                    `\`\`\`asciidoc\n` +
                    `• Guilds Count   :: ${await this.client.totalGuilds()}\n` +
                    `• Users count    :: ${await this.client.totalUsers()}\n` +
                    `• Channels count :: ${await this.client.totalChannels()}\n` +
                    `• Shards Count   :: ${this.client.shard.count}\n` +
                    `• Shards ID      :: ${this.client.shard.ids[0]}\n` +
                    `• Playing On     :: ${await this.client.totalPlaying()} Guild(s)` +
                    `\`\`\``
                )
                .addField(
                    "__SYSTEMS__",
                    `\`\`\`asciidoc\n` +
                    `• Discord.js     :: v${version}\n` +
                    `• Node.js        :: ${process.version}\n` +
                    `• Bot Version    :: v${require("../../../package.json").version}\n` +
                    `• Platform       :: ${os.platform()} ${os.arch()} Bit\n` +
                    `• CPU Usage      :: ${percent.toFixed(2)}%\n` +
                    `• Memory Usage   :: ${(await this.client.totalMemory("heapUsed") / 1024 / 1024).toFixed(2)} MB\n` +
                    `• OS Uptime      :: ${formatMs(os.uptime(), { secondsDecimalDigits: 0, compact: false })}\n` +
                    `• Process Uptime :: ${formatMs(process.uptime() * 1000, { secondsDecimalDigits: 0, compact: false })}\n` +
                    `• Processor      :: ${os.cpus().map(i => `${i.model}`)[0]}\n` +
                    `\`\`\``
                )
                .setTimestamp()
                .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096, format: "png" }));

            message.channel.send(systemembed)
        })
    };
};

async function geneembed(message, data, client) {
    let array = [];
    let k = 3;
    for (let i = 0; i < data.length; i += 3) {
        const current = data.slice(i, k);
        k += 3;

        const map = await current.map((x) =>
            `**\`\`\`asciidoc\n` +
            `• Node       :: ${x.node}\n` +
            `• Status     :: ${x.state}\n` +
            `• Cores      :: ${x.core}\n` +
            `• Uptime     :: ${x.uptime}\n` +
            `• Mem Usage  :: ${(x.memoryUsage / Math.pow(1024, Math.floor(Math.log(x.memoryUsage) / Math.log(1024)))).toFixed(2)} ${["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][Math.floor(Math.log(x.memoryUsage) / Math.log(1024))]}\n` +
            `• PlayerInfo :: ${x.players}\n` +
            `\`\`\`**`
        ).join("\n");

        let e = createEmbed("info")
            .setTitle("Lavalink Statistics")
            .setThumbnail(client.user.avatarURL({ dynamic: true, size: 4096, format: "png" }))
            .setDescription(map)
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096, format: "png" }))
        array.push(e)
    }
    return array;
};