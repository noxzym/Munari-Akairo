const { Command } = require("discord-akairo");
const { createEmbed } = require("../../Utils/CreateEmbed");

module.exports = class QueueCommand extends Command {
    constructor() {
        super("QueueCommand", {
            aliases: ["queue", "q"],
            category: "\`🎶\`| Music",
            description: {
                content: "View all music list",
                usage: "queue"
            },
            cooldown: 1e4,
            channel: "guild",
            ownerOnly: false,
            editable: false,
            typing: false,
            quoted: false,
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            userPermissions: null,
        })
    };
    async exec(message) {
        const queue = message.guild.queue;
        if (!queue) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Nothing music are playng now")).then(x => x.delete({ timeout: 10000 }));

        const embeds = await geneembed(message, queue.songs);
        let page = 0;
        var embed = await message.channel.send(embeds[page])
        await this.client.util.pagination(embed, page, embeds, message)
    };
};
async function geneembed(message, queue) {
    const embeds = [];
    const track = queue.slice(1).length;
    const estimate = await message.client.util.parseMs(eval(queue.slice(1).map(x => x.nowplaying).filter(x => x !== undefined).join('+')) * 1000);
    let k = 5
    for (let i = 0; i < queue.length; i += 5) {
        const current = queue.slice(i + 1, k + 1);
        let j = i
        k += 5
        const inf = current.map((x) => `**${++j} • [${x.title}](${x.url}) \`【${x.requester.username}】\`**`).join('\n')

        let e = createEmbed("info")
            .setAuthor("Music List")
            .setThumbnail(queue[0].thumbnail)
            .setDescription(`** • [${queue[0].title}](${queue[0].url}) \`【${queue[0].requester.username}】\` • \n\n▬▬▬▬▬▬▬▬ List of Queue ▬▬▬▬▬▬▬▬**\n${inf}`)
            .setTimestamp();

        queue.slice(1).length === 0 ? e.setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true })) : e.setFooter(`Total ${track} songs in ${estimate}`, message.author.avatarURL({ dynamic: true }))

        if (queue.length === 1) {
            e.setDescription(
                `** • [${queue[0].title}](${queue[0].url}) \`【${queue[0].requester.username}】\` • \n\n▬▬▬▬▬▬▬▬ List of Queue ▬▬▬▬▬▬▬▬**\nNo song in here? use **\`${message.client.commandHandler.prefix}play <song[title/url]>\`**`
            )
        }
        embeds.push(e)
    }
    return embeds;
}