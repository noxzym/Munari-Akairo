const { Command } = require("discord-akairo");
const { createEmbed } = require("../../Utils/CreateEmbed");

module.exports = class TextblockCommand extends Command {
    constructor() {
        super("TextblockCommand", {
            aliases: ["textblock"],
            category: "Fun",
            description: {
                content: "Generate text block",
                usage: "textblock <text>"
            },
            args: [
                {
                    id: "text",
                    match: "content"
                }
            ],
            cooldown: 1.5e4,
            channel: "guild",
            ownerOnly: false,
            editable: false,
            typing: true,
            quoted: false,
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            userPermissions: null,
        })
    }
    async exec(message, { content }) {
        if (!content) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Please provide text")).then(x => x.delete({ tineout: 10000 }));
        const input = content
            .join(" ")
            .toLowerCase()
            .replace(/[a-z]/g, ":regional_indicator_$&:")
            .replace(/1/g, ":one:")
            .replace(/2/g, ":two:")
            .replace(/3/g, ":three:")
            .replace(/4/g, ":four:")
            .replace(/5/g, ":five:")
            .replace(/6/g, ":six:")
            .replace(/7/g, ":seven:")
            .replace(/8/g, ":eight:")
            .replace(/9/g, ":nine:")
            .replace(/0/g, ":zero:");
        message.channel.send(input)
    }
};