const { Command } = require("discord-akairo");
const { Util, MessageAttachment } = require('discord.js');
const { createEmbed } = require("../../Utils/CreateEmbed")

module.exports = class InvertCommand extends Command {
    constructor() {
        super("InvertCommand", {
            aliases: ["invert"],
            category: "Image",
            description: {
                content: "Add invert filter to image",
                usage: "invert [user/image/^]"
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
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            userPermissions: null,
        })
    }
    async exec(message, { parse }) {
        if (!parse) parse = message
        try {
            var data = await this.client.util.parsemsg(Util, message, parse);
        } catch {
            return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Invalid Data")).then(x => x.delete({ timeout: 10000 }));
        }

        const bufferdata = await this.client.util.canvas.invert(data);
        const ath = new MessageAttachment(bufferdata, "invert.png")

        let e = createEmbed("info")
            .setImage('attachment://invert.png')
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096 }))
        message.channel.send({ files: [ath], embed: e })
    }
}