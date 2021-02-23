const { Command } = require("discord-akairo");
const { MessageAttachment } = require("discord.js");
const { createEmbed } = require("../../Utils/CreateEmbed");
const fetch = require("node-fetch");

module.exports = class RabbitCommand extends Command {
    constructor() {
        super("RabbitCommand", {
            aliases: ["rabbit", "bunny"],
            category: "Animal",
            description: {
                content: "Giving the random pic of rabbit",
                usage: "rabbit"
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
        const { media } = await fetch("https://api.bunnies.io/v2/loop/random/?media=gif,png").then(x => x.json());
        const ath = new MessageAttachment(media.poster, "rabbit.png");

        let e = createEmbed("info")
            .setAuthor(`🐇| This is your rabbit ${message.author.username}`)
            .setImage("attachment://rabbit.png")
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
            .setTimestamp();
        message.util.send({ embed: e, files: [ath] })
    }
}