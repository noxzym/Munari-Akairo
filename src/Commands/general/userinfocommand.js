const { Command } = require("discord-akairo");
const { createEmbed } = require("../../Utils/CreateEmbed")
const moment = require('moment');
moment.locale();

module.exports = class UserinfoCommand extends Command {
    constructor() {
        super("UserinfoCommand", {
            aliases: ["userinfo", "ui"],
            category: "\`🎭\`| General",
            description: {
                content: "Display user informations",
                usage: "userinfo [user[mention/id]]"
            },
            args: [
                {
                    id: "user",
                    match: "content"
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
    async exec(message, { user }) {
        const member =
            message.guild.member(user) ||
            message.mentions.members.first() ||
            message.member;

        console.log(message.member)

        const roles = member.roles.cache.sort((a, b) => b.position - a.position);
        const date = moment(member.user.createdAt).format("MMM Do YYYY");
        const Jdate = moment(member.joinedAt).format("MMM Do YYYY");

        let bot;
        if (member.user.bot) {
            bot = "Beep Boop. Boop Beep?"
        } else {
            bot = "What's up?"
        }

        const e = createEmbed("info")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setDescription(`**__User Informations__**\n**\`\`\`asciidoc\n• UserName     :: ${member.user.tag}\n• UserID       :: ${member.user.id}\n• Created At   :: ${date}\n• Joined At    :: ${Jdate}\n• Highest Role :: ${roles.first().name}\n• Lowest Role  :: ${roles.last(2)[0].name}\n• Type         :: ${bot}\n\`\`\`**`)
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
            .setTimestamp()
        message.channel.send(e)
    };
}