const { Command } = require("discord-akairo");
const { createEmbed } = require("../../Utils/CreateEmbed");
const { data } = require("../../data/Changelog.json");

module.exports = class ChangelogCommand extends Command {
    constructor() {
        super("ChangelogCommand", {
            aliases: ["changelog", "latest"],
            category: "Utility",
            description: {
                content: "Get latest change",
                usage: "changelog"
            },
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
    async exec(message) {
        let page = 0;
        const embed = await geneembed(message, data, this.client);
        let ems = await message.channel.send(embed[page])
        await this.client.util.pagination(ems, page, embed, message, this.client)
    };
};
async function geneembed(message, data, client) {
    let array = [];
    let k = 5;
    for (let i = 0; i < data.length; i += 5) {
        const current = data.slice(i, k);
        let j = i + 1
        k += 5
        const map = current.map((x) => `**${j++}. ${x.date}**\n${x.content.join("\n")}`).join("\n\n");

        let e = createEmbed("info")
            .setAuthor("Changelog", client.user.avatarURL({ dynamic: true, size: 4096, format: "png" }))
            .setDescription(map)
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096, format: "png" }))
        array.push(e)
    }
    return array;
};