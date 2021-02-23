const { Command } = require("discord-akairo");
const { MessageAttachment } = require('discord.js')
const alex = require('alexflipnote.js');
const { createEmbed } = require("../../Utils/CreateEmbed");

module.exports = class SupremeCommand extends Command {
    constructor() {
        super("SupremeCommand", {
            aliases: ["supreme"],
            category: "Fun",
            description: {
                content: "Generate supreme image",
                usage: "supreme <text>"
            },
            args: [
                {
                    id: "content",
                    match: "content"
                },
                {
                    id: "dark",
                    match: "flag",
                    flag: "--dark"
                },
                {
                    id: "light",
                    match: "flag",
                    flag: "--light"
                }
            ],
            cooldown: 1.5e4,
            channel: "guild",
            ownerOnly: false,
            editable: false,
            typing: true,
            quoted: false,
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES"],
            userPermissions: null,
        })
    }
    async exec(message, { content, dark, light }) {
        const { image } = new alex(this.client.config.alexapi)
        if (!content) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. You need input text first")).then(x => x.delete({ timeout: 10000 }));
        if (content.length > 15) return message.channel.send(createEmbed("error", "maximum length of text is 15")).then(msg => { msg.delete({ timeout: 10000 }) });

        let img;
        if (dark) {
            let inputin = content.replace('--dark', '')
            img = await image.supreme({ text: `${inputin}`, dark: true })
        } else if (light) {
            let inputin = content.replace('--light', '')
            img = await image.supreme({ text: `${inputin}`, light: true })
        } else {
            img = await image.supreme({ text: `${content}` })
        }
        let ath = new MessageAttachment(img, "supreme.png")
        message.channel.send(ath)
    }
};