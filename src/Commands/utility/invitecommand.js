const { Command } = require("discord-akairo");
const { createEmbed } = require("../../Utils/CreateEmbed")

module.exports = class InviteCommand extends Command {
    constructor() {
        super("InviteCommand", {
            aliases: ["invite"],
            category: "Utility",
            description: {
                content: "Vote me",
                usage: "vote"
            },
            cooldown: 5e3,
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
        let inviteEmbed = createEmbed("info")
            .setAuthor("Invite Me!")
            .setDescription(`Do you want to invite me? click [[**\`HERE\`**](https://discord.com/oauth2/authorize?client_id=740112353483554858&scope=bot&permissions=2146827639)]\nAlso you can vote me in [[**\`HERE\`**](https://top.gg/bot/740112353483554858/vote)]`)
            .setThumbnail(this.client.user.avatarURL({ size: 4096 }))
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }));
        message.channel.send(inviteEmbed);
    }
}