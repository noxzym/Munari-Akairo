const { Command } = require("discord-akairo");
const { MessageAttachment } = require("discord.js");
const { createEmbed } = require("../../Utils/CreateEmbed");

module.exports = class ChangemymindCommand extends Command {
    constructor() {
        super("ChangemymindCommand", {
            aliases: ["changemymind", "chm"],
            category: "Fun",
            description: {
                content: "Generate change my mind command",
                usage: "changemymind <text>"
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
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            userPermissions: null,
        })
    }
    async exec(message, { content }) {
        if (!content) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. No query given")).then(x => x.delete({ timeout: 10000 }));
        if (content.length > 20) return message.channel.send(createEmbed("error", "maximum length of text is 20")).then(msg => { msg.delete({ timeout: 10000 }) });
        
        const msg = `https://vacefron.nl/api/changemymind?text=${content}`
        const ath = new MessageAttachment(msg, "chm.png")

        const e = createEmbed("info")
            .setImage('attachment://chm.png')
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }));
        message.channel.send({ files: [ath], embed: e })
    }
};