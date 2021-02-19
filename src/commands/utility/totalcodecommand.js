const { Command } = require("discord-akairo");
const glob = require("glob");
const { readFileSync } = require("fs");
const { createEmbed } = require("../../utils/createEmbed");

module.exports = class TotalcodeCommand extends Command {
    constructor() {
        super("TotalcodeCommand", {
            aliases: ["totalcode"],
            category: "\`🛠️\`| Utility",
            description: {
                content: "Get total code of bot",
                usage: "totalcode"
            },
            cooldown: 1e5,
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
        glob("src/**/*.js", async (e, f) => {
            if (e) throw e;
            let h = 0, i = 0, j = 0, k = 0;
            let l = "", m = "";

            let length = f.length;
            await Promise.all(f.map(x => {
                const str = readFileSync(x).toString();
                const data = str.split("\n").length
                h = h + data;
                i = i + str.length;
                if (data > j) {
                    j = data;
                    l = x.slice((x.lastIndexOf("/") - 1 >>> 0) + 2);
                };
                if (str.length > k) {
                    k = str.length;
                    m = x.slice((x.lastIndexOf("/") - 1 >>> 0) + 2)
                };
                return null;
            }));

            let muah = createEmbed("info")
                .setAuthor(`${this.client.user.username} • Totalcode`, this.client.user.avatarURL({ dynamic: true, size: 4096, format: "png" }), "https://discord.com/oauth2/authorize?client_id=740112353483554858&scope=bot&permissions=2146827639")
                .setDescription(
                    `**\`\`\`asciidoc\n` +
                    `• Total Files   :: ${length.toString()} Files\n` +
                    `• Total Lines   :: ${h.toString()} Lines\n` +
                    `• Total Letter  :: ${i.toString()} Letters\n\n` +
                    `File with the Highest amount of lines is ${l.split(".")[0]}\n` +
                    `File with the Highet amount of letter is ${m.split(".")[0]}` +
                    `\n\`\`\`**`
                )
                .setTimestamp()
                .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }));
            message.channel.send(muah)
        })
    };
}