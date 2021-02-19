const { Command } = require("discord-akairo");
const { MessageAttachment } = require("discord.js");
const fetch = require("node-fetch");
const { createEmbed } = require("../../utils/createEmbed");

module.exports = class SlapCommand extends Command {
    constructor() {
        super("SlapCommand", {
            aliases: ["slap"],
            category: "\`😉\`| Action",
            description: {
                content: "Slap someone",
                usage: "slpa [user]"
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

        const { url } = await fetch("https://nekos.life/api/v2/img/slap").then(x => x.json())
        const ath = new MessageAttachment(url, 'slap.gif')

        if (!member) {
            const e = createEmbed("info")
                .setTitle(`${message.author.username} Want to slap your face`)
                .setImage('attachment://slap.gif')
                .setTimestamp()
                .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096 }))
            return message.channel.send({ files: [ath], embed: e });
        };

        const e = createEmbed("info")
            .setTitle(`${member.user.username} has been Slaped by ${message.author.username}`)
            .setImage('attachment://slap.gif')
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096 }))
        message.channel.send({ files: [ath], embed: e });
    };
}