const { Command } = require("discord-akairo")
const { createEmbed } = require("../../Utils/CreateEmbed")

module.exports = class AvatarCommand extends Command {
    constructor() {
        super("AvatarCommand", {
            aliases: ["avatar", "av"],
            category: "\`🎭\`| General",
            description: {
                content: "Display Avatar User",
                usage: "avatar [user]"
            },
            args: [
                {
                    id: "user",
                    match: "content"
                },
                {
                    id: "server",
                    match: "flag",
                    flag: "--server"
                }
            ],
            cooldown: 1e4,
            channel: "guild",
            ownerOnly: false,
            editable: false,
            typing: true,
            quoted: false,
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            userPermissions: null,
        })
    };
    async exec(message, { server, user }) {
        if (server) {
            let e = createEmbed("info")
                .setAuthor(`${message.guild.name}`, message.guild.iconURL({ dynamic: true, size: 4096, format: "png" }), message.guild.iconURL({ dynamic: true, size: 4096, format: "png" }))
                .setImage(message.guild.iconURL({ format: 'png', dynamic: true, size: 4096 }))
                .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
                .setTimestamp();
            return message.channel.send(e)
        };
        let member =
            message.guild.members.cache.get(user) ||
            message.guild.members.cache.find(x => x.user.username.toLowerCase() === `${user}` || x.user.username === `${user}`) ||
            message.mentions.members.first() ||
            message.member;

        let e = createEmbed("info")
            .setAuthor(`${member.user.tag}`, member.user.avatarURL({ format: "png", dynamic: true, size: 4096 }), member.user.avatarURL({ format: "png", dynamic: true, size: 4096 }))
            .setImage(member.user.avatarURL({ format: "png", dynamic: true, size: 4096 }))
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
            .setTimestamp();
        message.channel.send(e)
    };
}