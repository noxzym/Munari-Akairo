const { Command } = require("discord-akairo");
const { MessageAttachment } = require("discord.js");
const fetch = require("node-fetch");
const { createEmbed } = require("../../Utils/CreateEmbed")

module.exports = class HugCommand extends Command {
    constructor() {
        super("HugCommand", {
            aliases: ["hug"],
            category: "Action",
            description: {
                content: "Hug someone",
                usage: "hug [user]"
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

        const { url } = await fetch("https://nekos.life/api/v2/img/hug").then(x => x.json());
        const ath = new MessageAttachment(url, 'hug.gif')

        if (!member) {
            const e = createEmbed("info")
                .setTitle(`${message.author.username} Want to Hug you`)
                .setImage('attachment://hug.gif')
                .setTimestamp()
                .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096 }))
            return message.channel.send({ files: [ath], embed: e });
        };

        const e = createEmbed("info")
            .setTitle(`${member.user.username} has been Hugged by ${message.author.username}`)
            .setImage('attachment://hug.gif')
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096 }))
        message.channel.send({ files: [ath], embed: e });
    };
}