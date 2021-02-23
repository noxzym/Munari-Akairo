const { Command } = require("discord-akairo");
const { MessageAttachment } = require("discord.js");
const { createEmbed } = require("../../Utils/CreateEmbed");
const fetch = require("node-fetch");

module.exports = class FoxCommand extends Command {
    constructor() {
        super("FoxCommand", {
            aliases: ["fox"],
            category: "Animal",
            description: {
                content: "Giving the random pic of fox",
                usage: "fox"
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
        const { image } = await fetch("https://randomfox.ca/floof/").then(x => x.json());
        let ath = new MessageAttachment(image, "fox.png");

        const e = createEmbed("info")
            .setAuthor(`🦊| This is your fox ${message.author.username}`)
            .setImage("attachment://fox.png")
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096, format: "png" }))
        message.util.send({ embed: e, files: [ath]})
    }
}