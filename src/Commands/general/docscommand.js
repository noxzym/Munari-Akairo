const { Command } = require("discord-akairo");
const fetch = require('node-fetch');
const { createEmbed } = require("../../Utils/CreateEmbed")

module.exports = class DocsCommand extends Command {
    constructor() {
        super("DocsCommand", {
            aliases: ["docs"],
            category: "General",
            description: {
                content: "Display Discord.js Documentation",
                usage: "docs <query>"
            },
            args: [
                {
                    id: "query",
                    match: "content"
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
    }
    async exec(message, { query }) {
        if (!query) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. No query given")).then(x => { x.delete({ timeout: 10000 }) });

        const data = await fetch(`https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(query)}`).then(res => res.json());
        if (!data) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Invalid Input")).then(x => { x.delete({ timeout: 10000 }) });

        message.channel.send({ embed: await data })
    }
}