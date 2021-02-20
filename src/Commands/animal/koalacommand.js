const { Command } = require("discord-akairo");
const { MessageAttachment } = require("discord.js");
const { createEmbed } = require("../../Utils/CreateEmbed");
const fetch = require("node-fetch");

module.exports = class KoalaCommand extends Command {
    constructor() {
        super("KoalaCommand", {
            aliases: ["koala"],
            category: "Animal",
            description: {
                content: "Giving the random pic of koala",
                usage: "koala"
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
        const { image } = await fetch("https://some-random-api.ml/animal/koala").then(x => x.json());
        const ath = new MessageAttachment(image, "koala.png");

        let e = createEmbed("info")
            .setAuthor(`🦝| This is your koala ${message.author.username}`)
            .setImage("attachment://koala.png")
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
            .setTimestamp();
        message.util.send({ embed: e, files: [ath] })
    };
}