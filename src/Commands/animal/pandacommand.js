const { Command } = require("discord-akairo");
const { MessageAttachment } = require("discord.js");
const { createEmbed } = require("../../Utils/CreateEmbed");
const fetch = require("node-fetch");

module.exports = class PandaCommand extends Command {
    constructor() {
        super("PandaCommand", {
            aliases: ["panda"],
            category: "Animal",
            description: {
                content: "Giving the random pic of panda",
                usage: "panda"
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
        const { image } = await fetch("https://some-random-api.ml/animal/panda").then(x => x.json());
        const ath = new MessageAttachment(image, "panda.png");

        let e = createEmbed("info")
            .setAuthor(`🐼| This is your panda ${message.author.username}`)
            .setImage("attachment://panda.png")
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
            .setTimestamp();
        message.util.send({ embed: e, files: [ath] })
    }
}