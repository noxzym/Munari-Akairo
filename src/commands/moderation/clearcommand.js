const { Command } = require("discord-akairo");
const { createEmbed } = require("../../utils/createEmbed")

module.exports = class ClearCommand extends Command {
    constructor() {
        super("ClearCommand", {
            aliases: ["clear", "prune"],
            category: "\`⚙️\`| Moderation",
            description: {
                content: "",
                usage: ""
            },
            args: [
                {
                    id: "parse",
                    match: "content"
                }
            ],
            cooldown: 1.5e4,
            channel: "guild",
            ownerOnly: false,
            editable: false,
            typing: true,
            quoted: false,
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_MESSAGES"],
            userPermissions: null,
        })
    };
    async exec(message, { parse }) {
        if (isNaN(parse)) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Please input the correct number")).then(x => x.delete({ timeout: 10000 }));
        if (parse > 100) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. I can't delete message over than 100 messages")).then(x => x.delete({ timeout: 10000 }));
        if (parse < 1) return;

        await message.channel.bulkDelete(parse, true)
    };
};