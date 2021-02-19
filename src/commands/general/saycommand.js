const { Command } = require("discord-akairo");
const { MessageAttachment } = require('discord.js');

module.exports = class SayCommand extends Command {
    constructor() {
        super("SayCommand", {
            aliases: ["say"],
            category: "\`🎭\`| General",
            description: {
                content: "Make me say anything",
                usage: "say <message>"
            },
            args: [
                {
                    id: "content",
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
    async exec(message, { content }) {
        (message.guild.me.hasPermission("MANAGE_MESSAGES") || message.channel.permissionsFor(client.user).has('MANAGE_MESSAGES')) ? message.delete() : null
        if (!content && message.attachments.first() === undefined) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. No message given")).then(x => { x.delete({ timeout: 10000 }) });

        if (message.attachments.first() !== undefined) {
            const ath = new MessageAttachment(message.attachments.first().url)
            if (!content) {
                return message.channel.send(ath)
            } else {
                return message.channel.send(content, ath);
            }
        } else {
            return message.channel.send(content);
        }
    };
}