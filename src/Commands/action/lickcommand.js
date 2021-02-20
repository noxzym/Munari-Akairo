const { Command } = require("discord-akairo");
const { MessageAttachment } = require("discord.js");
const fetch = require("node-fetch");
const { createEmbed } = require("../../Utils/CreateEmbed")

module.exports = class LickCommand extends Command {
    constructor() {
        super("LickCommand", {
            aliases: ["lick"],
            category: "Action",
            description: {
                content: "Lick Someone",
                usage: "lick [user]"
            },
            args: [
                {
                    id: "parse",
                    match: "content"
                }
            ],
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
    async exec(message, { parse }) {
        const member =
            message.guild.members.cache.get(parse) ||
            message.guild.members.cache.find(x => x.user.username.toLowerCase() === `${parse}` || x.user.username === `${parse}`) ||
            message.mentions.members.first();

        const { url } = await fetch("https://waifu.pics/api/sfw/lick").then(x => x.json());
        const ath = new MessageAttachment(url, "lick.gif");

        if (!member) {
            const e = createEmbed("info")
                .setTitle(`${message.author.username} Want to Lick you`)
                .setImage("attachment://lick.gif")
                .setTimestamp()
                .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096 }))
            return message.channel.send({ embed: e, files: [ath] });
        };

        const e = createEmbed("info")
            .setTitle(`${member.user.username} has been Licked by ${message.author.username}`)
            .setImage("attachment://lick.gif")
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096 }))
        message.channel.send({ embed: e, files: [ath] });
    };
}