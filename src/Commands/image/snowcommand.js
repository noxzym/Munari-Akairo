const { Command } = require("discord-akairo");
const { Util, MessageAttachment } = require('discord.js');
const { createEmbed } = require("../../Utils/CreateEmbed")
const alex = require('alexflipnote.js');

module.exports = class SnowCommand extends Command {
    constructor() {
        super("SnowCommand", {
            aliases: ["snow"],
            category: "\`🖼️\`| Image",
            description: {
                content: "Add snow filter to image",
                usage: "snow [user/image/^]"
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
    };
    async exec(message, { parse }) {
        const { image } = new alex(this.client.config.alexapi);
        if (!parse) parse = message
        try {
            var data = await this.client.util.parsemsg(Util, message, parse);
        } catch {
            return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Invalid Data")).then(x => x.delete({ timeout: 10000 }));
        }

        const img = await image.snow({ image: data });
        let ath = new MessageAttachment(img, "snow.png");
        let e = createEmbed("info")
            .setImage('attachment://snow.png')
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096 }))
        message.channel.send({ files: [ath], embed: e });
    };
}