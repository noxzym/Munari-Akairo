const { Command } = require("discord-akairo");
const { Util } = require("discord.js");
const { textSync } = require("figlet");
const { createEmbed } = require("../../Utils/CreateEmbed");

module.exports = class AsciiCommand extends Command {
    constructor() {
        super("AsciiCommand", {
            aliases: ["ascii"],
            category: "Fun",
            description: {
                content: "convert text to ascii style",
                usage: "ascii <text>"
            },
            args: [
                {
                    id: "content",
                    match: "content"
                }
            ],
            cooldown: 1.5e4,
            channel: "guild",
            ownerOnly: false,
            editable: false,
            typing: true,
            quoted: false,
            clientPermissions: ["SEND_MESSAGES"],
            userPermissions: null,
        })
    };
    async exec(message, { content }) {
        if (!content) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. No query given")).then(x => x.delete({ timeout: 10000 }));
        if (content.length > 20) return message.channel.send(createEmbed("error", "Maximum length of text is 20")).then(x => x.delete({ timeout: 10000 }))
        message.util.send(
            `\`\`\`\n` +
            `${textSync(Util.cleanContent(content))}`
            `\n\`\`\``
        )
    };
};
