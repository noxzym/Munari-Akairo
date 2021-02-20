const { Command } = require("discord-akairo");
const { MessageAttachment } = require("discord.js");
const { createEmbed } = require("../../Utils/CreateEmbed");
const fetch = require("node-fetch");

module.exports = class RacoonCommand extends Command {
    constructor() {
        super("RacoonCommand", {
            aliases: ["racoon"],
            category: "Animal",
            description: {
                content: "Giving the random pic of racoom",
                usage: "racoon"
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
        const { image } = await fetch("https://some-random-api.ml/animal/racoon").then(x => x.json());
        const ath = new MessageAttachment(image, "racoon.png");

        let e = createEmbed("info")
            .setAuthor(`🐨| This is your racoon ${message.author.username}`)
            .setImage("attachment://racoon.png")
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
            .setTimestamp();
        message.util.send({ embed: e, files: [ath] })
    };
}