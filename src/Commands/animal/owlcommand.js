const { Command } = require("discord-akairo");
const { MessageAttachment } = require("discord.js");
const { createEmbed } = require("../../Utils/CreateEmbed");
const fetch = require("node-fetch");

module.exports = class OwlCommand extends Command {
    constructor() {
        super("OwlCommand", {
            aliases: ["owl"],
            category: "Animal",
            description: {
                content: "Giving the random pic of owl",
                usage: "owl"
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
        const { image } = await fetch("http://pics.floofybot.moe/owl").then(x => x.json());
        const ath = new MessageAttachment(image, "owl.png");

        let e = createEmbed("info")
            .setAuthor(`🦉| This is your owl ${message.author.username}`)
            .setImage("attachment://owl.png")
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
            .setTimestamp();
        message.util.send({ embed: e, files: [ath] })
    }
}