const { Command } = require("discord-akairo");
const { MessageAttachment } = require("discord.js");
const { createEmbed } = require("../../Utils/CreateEmbed");
const fetch = require("node-fetch");

module.exports = class BirdCommand extends Command {
    constructor() {
        super("BirdCommand", {
            aliases: ["bird"],
            category: "\`🐶\`| Animal",
            description: {
                content: "Giving the random pic of bird",
                usage: "bird"
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
        const data = await fetch("https://shibe.online/api/birds").then(x => x.json());
        const ath = new MessageAttachment(data.join(" "), "bird.png");

        let e = createEmbed("info")
            .setAuthor(`🐦| This is your bird ${message.author.username}`)
            .setImage("attachment://bird.png")
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
            .setTimestamp();
        message.util.send({ embed: e, files: [ath] })
    };
}