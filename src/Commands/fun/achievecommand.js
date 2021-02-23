const { Command } = require("discord-akairo");
const { MessageAttachment } = require('discord.js');
const { createEmbed } = require("../../Utils/CreateEmbed");
const alex = require('alexflipnote.js');

module.exports = class AchievementCommand extends Command {
    constructor() {
        super("AchievementCommand", {
            aliases: ["achievement", "acv"],
            category: "Fun",
            description: {
                content: "Generate Achievement",
                usage: "acv <text>"
            },
            args: [
                {
                    id: "content",
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
    }
    async exec(message, { content }) {
        const { image } = new alex(this.client.config.alexapi);

        if (!content) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. No query given")).then(x => x.delete({ timeout: 10000 }));
        if (content.length > 20) return message.channel.send(createEmbed("error", "maximum length of text is 20")).then(msg => { msg.delete({ timeout: 10000 }) });

        let img = await image.achievement({ text: `${content}` });
        let ath = new MessageAttachment(img, "achievement.png");

        message.channel.send(ath)
    }
};