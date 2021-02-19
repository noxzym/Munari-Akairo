const { Command } = require("discord-akairo");
const { Util } = require('discord.js');
const { createEmbed } = require("../../Utils/CreateEmbed")
const moment = require('moment');
moment.locale()

module.exports = class EmojiCommand extends Command {
    constructor() {
        super("EmojiCommand", {
            aliases: ["emoji", "em"],
            category: "\`🎭\`| General",
            description: {
                content: "Get information about emoji",
                usage: "emoji <emoji>"
            },
            args: [
                {
                    id: "emoji",
                    match: "content"
                }
            ],
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
    async exec(message, { emoji }) {
        if (!emoji) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. No query given")).then(x => { x.delete({ timeout: 10000 }) })

        const eminfo = Util.parseEmoji(emoji)
        if (eminfo.id === null) return message.channel.send(`I can't get this emoji`).then(msg => { msg.delete({ timeout: 5000 }) })
        const image = eminfo.animated === false ? `https://cdn.discordapp.com/emojis/${eminfo.id}.png?size=4096` : `https://cdn.discordapp.com/emojis/${eminfo.id}.gif`
        const name = eminfo.name
        const ID = eminfo.id
        const createdAt = this.client.emojis.cache.get(ID) === undefined ? "Unknown" : moment(this.client.emojis.cache.get(ID).createdAt).format('MMMM Do YYYY, h:mm:ss a');
        const animated = eminfo.animated ? 'Yes' : 'No'
        const information = eminfo.animated === false ? `<:${eminfo.name}:${eminfo.id}>` : `<a:${eminfo.name}:${eminfo.id}>`

        let e = createEmbed("info")
            .setDescription(`**Name: \`${name}\`\nID: \`${ID}\`\nAnimated: \`${animated}\`\nIdentifier: \`${information}\`\nCreatedAt: \`${createdAt}\`**`)
            .setImage(image)
        message.channel.send(e)
    };
}