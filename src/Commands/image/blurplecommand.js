const { Command } = require("discord-akairo");
const { Util, MessageAttachment } = require('discord.js');
const { createEmbed } = require("../../Utils/CreateEmbed")
const fetch = require("node-fetch");

module.exports = class BlurpleCommand extends Command {
    constructor() {
        super("BlurpleCommand", {
            aliases: ["blurple"],
            category: "Image",
            description: {
                content: "Add blue purple filter to image",
                usage: "blurple [user/image/^]"
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

        const { url } = await fetch(`https://neko-love.xyz/api/v2/blurple?url=${data}`).then(x => x.json())
        let ath = new MessageAttachment(url, "blurple.png")

        const e = createEmbed("info")
            .setImage("attachment://blurple.png")
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096 }))
        message.channel.send({ embed: e, files: [ath] });
    }
}