const { Command } = require("discord-akairo");
const { Util } = require("discord.js")
const { createEmbed } = require("../../utils/createEmbed");

module.exports = class RespectCommand extends Command {
    constructor() {
        super("RespectCommand", {
            aliases: ["respect", "f"],
            category: "\`🎭\`| General",
            description: {
                content: "Pay respect for something",
                usage: "respect [thing]"
            },
            args: [
                {
                    id: "thing",
                    match: "content"
                }
            ],
            cooldown: 6e4,
            ratelimit: 1,
            channel: "guild",
            ownerOnly: false,
            editable: false,
            typing: true,
            quoted: false,
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            userPermissions: null,
        })
    };
    async exec(message, { thing }) {
        let data
        if (thing) {
            data = `**Press 🇫 to pay your respect for \`${Util.cleanContent(thing, message).replace("@", "")}\`**`
        } else {
            data = `**Press 🇫 to pay your respect**`
        }

        let e = createEmbed("info")
            .setDescription(data)

        var respect = await message.channel.send(e)
        await respect.react("🇫")

        try {
        const collector = respect.createReactionCollector((reaction, user) => reaction.emoji.name === "🇫" && user.id !== this.client.user.id, { time: 60000, errors: ["time"] });
        const array = [];
        collector.on("collect", async (reaction, user) => {
            switch (reaction.emoji.name) {
                case "🇫":
                    if (array.includes(user.id)) return
                    array.push(user.id);
                    message.channel.send(`**\`${user.tag}\` just paid their respect**`)
                    break;

                default:
                    break;
            }
        })
        collector.on("end", () => {
            const data = array.length;
            let desc;
            if (thing) {
                desc = data !== undefined ? data !== 0 ? `**Total \`${data}\` User has paid their respect for \`${Util.cleanContent(thing, message).replace("@", "")}\`**` : `**Nobody paid their respect for ${Util.cleanContent(thing, message).replace("@", "")}**` : `**Nobody paid their respect for \`${Util.cleanContent(thing, message).replace("@", "")}\`**`;
            } else {
                desc = data !== undefined ? data !== 0 ? `**Total \`${data}\` User has paid their respect**` : `**Nobody paid their respect**` : `**Nobody paid their respect**`;
            }

            let ed = createEmbed("info")
                .setDescription(desc)

            message.channel.send(ed)
            return array.splice(0, array.length)
        });
    } catch {
            message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. I got some error")).then(x => { x.delete({ timeout: 10000 }) });
    }
    };
}