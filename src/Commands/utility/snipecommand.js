const { Command } = require("discord-akairo");
const { createEmbed } = require("../../Utils/CreateEmbed")

module.exports = class SnipeCommand extends Command {
    constructor() {
        super("SnipeCommand", {
            aliases: ["snipe"],
            category: "Utility",
            description: {
                content: "Get last message delete",
                usage: "snipe [channel]"
            },
            args: [
                {
                    id: "channelid",
                    match: "content"
                },
                {
                    id: "all",
                    match: "flag",
                    flag: "--all"
                }
            ],
            cooldown: 1e4,
            channel: "guild",
            ownerOnly: false,
            editable: false,
            typing: true,
            quoted: false,
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            userPermissions: null,
        })
    };
    async exec(message, { channelid, all }) {
        const channel = message.guild.channels.cache.get(channelid) || message.mentions.channels.first() || message.channel;
        const snipes = this.client.snipes.get(channel.id);
        if (!snipes) return message.channel.send(createEmbed("error", `I can't get last message delete in channel **\`${channel.name}\`**`)).then(msg => { msg.delete({ timeout: 10000 }) });

        let page = 0;
        const embeds = await geneembed(snipes, channel)
        let send = await message.channel.send(embeds[page])

        if (all) return await this.client.util.pagination(send, page, embeds, message, this.client)
    };
};

async function geneembed(snipes, channel) {
    const embeds = [];
    let k = 1;
    for (let i = 0; i < snipes.length; i++) {
        const now = snipes.slice(i, k);
        k += 5;
        const maping = await now[0];

        const content = maping.content.length <= 2047 ? maping.content : maping.content.substr(0, 2047).trim() + " ...";
        let e = createEmbed("info")
            .setAuthor(`Message Deleted by ${maping.author.tag}`, maping.author.avatarURL({ dynamic: true }))
            .setDescription(content)
            .setImage(maping.image)
            .setFooter(`${maping.date} • #${channel.name}`)
        embeds.push(e);
    };
    return embeds
}