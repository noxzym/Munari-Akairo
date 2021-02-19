const { Command } = require("discord-akairo");
const { MessageAttachment } = require("discord.js");
const { createEmbed } = require("../../Utils/CreateEmbed");
const fetch = require("node-fetch");

module.exports = class DogCommand extends Command {
    constructor() {
        super("DogCommand", {
            aliases: ["dog"],
            category: "\`🐶\`| Animal",
            description: {
                content: "Givinig the random pic of dog",
                usage: "dog"
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
    async exec(msg) {
        const { message } = await fetch("https://dog.ceo/api/breeds/image/random").then(x => x.json());
        const ath = new MessageAttachment(message, "dog.png");

        const e = createEmbed("info")
            .setAuthor(`🐕| This is your dog ${msg.author.username}`)
            .setImage("attachment://dog.png")
            .setTimestamp()
            .setFooter(`Commanded by ${msg.author.tag}`, msg.author.avatarURL({ dynamic: true, size: 4096, format: "png" }))
        msg.util.send({ embed: e, files: [ath] });
    };
}