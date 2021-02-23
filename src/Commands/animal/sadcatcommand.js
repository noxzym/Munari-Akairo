const { Command } = require("discord-akairo");
const { MessageAttachment } = require("discord.js");
const { createEmbed } = require("../../Utils/CreateEmbed");
const alex = require('alexflipnote.js')

module.exports = class SadcatCommand extends Command {
    constructor() {
        super("SadcatCommand", {
            aliases: ["sadcat"],
            category: "Animal",
            description: {
                content: "Giving the random pic of sadcat",
                usage: ""
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
    }
    async exec(message) {
        const { image } = new alex(this.client.config.alexapi);
        const { file } = await image.sadcat();
        const ath = new MessageAttachment(file, "sadcat.png");

        let e = createEmbed("info")
            .setAuthor(`😿| I need your hug ${message.author.username}`)
            .setImage("attachment://sadcat.png")
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096, format: "png" }))
        message.util.send({ embed: e, files: [ath] })
    }
}