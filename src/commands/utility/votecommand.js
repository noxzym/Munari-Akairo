const { Command } = require("discord-akairo");
const { MessageAttachment } = require('discord.js')
const { createEmbed } = require("../../utils/createEmbed");

module.exports = class VoteCommand extends Command {
    constructor() {
        super("VoteCommand", {
            aliases: ["vote"],
            category: "\`🛠️\`| Utility",
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
    };
    async exec(message) {
        let ath = new MessageAttachment('https://top.gg/api/widget/740112353483554858.png', 'topgg.png')
        let topgg = await this.client.dbl.getBot("740112353483554858").then(x => x.monthlyPoints)

        let e = createEmbed("info")
            .setAuthor(`Vote me!`, this.client.user.avatarURL({ size: 4096, format: "png" }))
            .setDescription(`Do you want to vote me? click [[**\`HERE\`**](https://top.gg/bot/740112353483554858/vote)]\nI have **\`${topgg}\`** Votes for this month`)
            .setImage('attachment://topgg.png')
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
        message.channel.send({ files: [ath], embed: e })
    };
}