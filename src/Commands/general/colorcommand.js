const { Command } = require("discord-akairo");
const { MessageAttachment } = require("discord.js");
const { createEmbed } = require("../../Utils/CreateEmbed")
const alex = require('alexflipnote.js')

module.exports = class ColorCommand extends Command {
    constructor() {
        super("ColorCommand", {
            aliases: ["color"],
            category: "General",
            description: {
                content: "Get sample color of hexcolor",
                usage: "color <hex>"
            },
            args: [
                {
                    id: "color",
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
    async exec(message, { color }) {
        const { others } = new alex(this.client.config.alexapi)
        if (!color) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. No query given")).then(x => { x.delete({ timeout: 10000 }) });

        try {
            var data = await others.color(color.replace('#', ''))
            var hex = data.hex
            var image = data.image
            var gradient = data.image_gradient
            var int = data.int
            var name = data.name
            var bright = data.brightness
            var rgb = data.rgb
        } catch (e) {
            return message.channel.send(createEmbed("error", `<a:no:765207855506522173> | Operation Canceled. Not a valid hex value`)).then(x => { x.delete({ timeout: 10000 }) });
        }

        const ath = new MessageAttachment(gradient, `color.png`)
        const e = createEmbed()
            .setColor(hex)
            .setTitle(`${name} • ${hex}`)
            .setDescription(`\`\`\`asciidoc\n• Color name    :: ${name}\n• Color hex     :: ${hex}\n• Color RGB     :: ${rgb}\n• Color Int     :: ${int}\n• Color Brightness :: ${bright}\n\`\`\``)
            .setImage('attachment://color.png')
            .setThumbnail(image)
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
        message.channel.send({ embed: e, files: [ath] });
    };
}