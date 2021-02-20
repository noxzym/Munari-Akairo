const { Command } = require("discord-akairo");
const { MessageAttachment } = require("discord.js");
const { createEmbed } = require("../../Utils/CreateEmbed")
const fetch = require("node-fetch");

module.exports = class BullyCommand extends Command {
    constructor() {
        super("BullyCommand", {
            aliases: ["bully"],
            category: "Action",
            description: {
                content: "Bully someone",
                usage: "bully [user]"
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

        const { url } = await fetch("https://waifu.pics/api/sfw/bully").then(x => x.json());
        let ath = new MessageAttachment(url, "bully.gif");

        if (!member) {
            const e = createEmbed("info")
                .setTitle(`${message.author.username} Want to Bully you`)
                .setImage("attachment://bully.gif")
                .setTimestamp()
                .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096 }))
            return message.channel.send({ embed: e, files: [ath] });
        };
        
        const e = createEmbed("info")
            .setTitle(`${member.user.username} has been Bullied by ${message.author.username}`)
            .setImage("attachment://bully.gif")
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096 }))
        message.channel.send({ embed: e, files: [ath] });
    };
}