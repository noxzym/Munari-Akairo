const { Command } = require("discord-akairo");
const { MessageAttachment } = require("discord.js");
const fetch = require("node-fetch");
const { createEmbed } = require("../../utils/createEmbed");

module.exports = class PunchCommand extends Command {
    constructor() {
        super("PunchCommand", {
            aliases: ["punch"],
            category: "\`😉\`| Action",
            description: {
                content: "Punch someone",
                usage: "punch [user]"
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

        const { url } = await fetch("https://neko-love.xyz/api/v1/punch").then(x => x.json())
        const ath = new MessageAttachment(url, "punch.gif");

        if (!member) {
            const e = createEmbed("info")
                .setTitle(`${message.author.username} Want to Punch you`)
                .setImage("attachment://punch.gif")
                .setTimestamp()
                .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096 }))
            return message.channel.send({ embed: e, files: [ath] });
        };

        const e = createEmbed("info")
            .setTitle(`${member.user.username} was Punched by ${message.author.username}`)
            .setImage("attachment://punch.gif")
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096 }))
        message.channel.send({ embed: e, files: [ath] });
    };
}