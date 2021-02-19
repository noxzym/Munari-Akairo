const { Command } = require("discord-akairo");
const { MessageAttachment } = require("discord.js");
const { createEmbed } = require("../../Utils/CreateEmbed");
const fetch = require("node-fetch");

module.exports = class CatCommand extends Command {
    constructor() {
        super("CatCommand", {
            aliases: ["cat"],
            category: "\`🐶\`| Animal",
            description: {
                content: "Giving the random pic of cat",
                usage: "cat"
            },
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
    async exec(message) {
        const { file } = await fetch("http://aws.random.cat/meow").then(x => x.json());
        const ath = new MessageAttachment(file, "cat.png");

        const e = createEmbed("info")
            .setAuthor(`🐈| This is your cat ${message.author.username}`)
            .setImage("attachment://cat.png")
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096, format: "png" }))
        message.util.send({ embed: e, files: [ath] })
    };
}