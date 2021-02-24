const { Command } = require("discord-akairo");
const { createEmbed } = require("../../Utils/CreateEmbed")

module.exports = class HelpCommand extends Command {
    constructor() {
        super("HelpCommand", {
            aliases: ["help", "h", "?"],
            category: "Utility",
            description: {
                content: "Display help command",
                usage: "help [command]"
            },
            args: [
                {
                    id: "command",
                    type: "commandAlias"
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
    }
    async exec(message, { command }) {
        const prefix = this.client.settings.get(message.guild.id, "prefix", "m!");
        const totalcmd = this.handler.categories.map(x => x.size).reduce((a, b) => b + a)
        if (command) {
            let e = createEmbed("info")
                .setDescription(
                    `**__Help Commands__**\n` +
                    `**\`\`\`asciidoc\n` +
                    `• Name        :: ${command.aliases[0]}\n` +
                    `• Aliases     :: ${command.aliases.slice(1).join(", ") === "" ? "-" : command.aliases.slice(1).join(", ")}\n` +
                    `• Flags       :: ${command.contentParser.flagWords.join(" ") === "" ? "-" : `[${command.contentParser.flagWords.join(" ")}]`}\n` +
                    `• Description :: ${command.description.content}\n` +
                    `• Usage       :: ${command.description.usage}\n` +
                    `• Cooldowns   :: ${command.cooldown/1000}s\n` +
                    `\`\`\`**`
                )
                .setThumbnail(this.client.user.displayAvatarURL())
                .setFooter(`ℹ️ Don't include <> or []. It's mean, <> is required and [] is optional`)
            return message.util.send(e)
        }

        const action = this.handler.categories.filter(x => x.id === "Action").first().filter(x => x.aliases.length > 0).map(x => `**\`${x.aliases[0]}\`**`).join(", ");
        const animal = this.handler.categories.filter(x => x.id === "Animal").first().filter(x => x.aliases.length > 0).map(x => `**\`${x.aliases[0]}\`**`).join(", ");
        const fun = this.handler.categories.filter(x => x.id === "Fun").first().filter(x => x.aliases.length > 0).map(x => `**\`${x.aliases[0]}\`**`).join(", ");
        const general = this.handler.categories.filter(x => x.id === "General").first().filter(x => x.aliases.length > 0).map(x => `**\`${x.aliases[0]}\`**`).join(", ");
        const image = this.handler.categories.filter(x => x.id === "Image").first().filter(x => x.aliases.length > 0).map(x => `**\`${x.aliases[0]}\`**`).join(", ");
        const moderation = this.handler.categories.filter(x => x.id === "Moderation").first().filter(x => x.aliases.length > 0).map(x => `**\`${x.aliases[0]}\`**`).join(", ");
        const music = this.handler.categories.filter(x => x.id === "Music").first().filter(x => x.aliases.length > 0).map(x => `**\`${x.aliases[0]}\`**`).join(", ");
        const Utility = this.handler.categories.filter(x => x.id === "Utility").first().filter(x => x.aliases.length > 0).map(x => `**\`${x.aliases[0]}\`**`).join(", ");

        let e = createEmbed("info")
            .setAuthor(this.client.user.username, this.client.user.displayAvatarURL())
            .setDescription(`Type **\`${prefix}help [command]\`** to get how to use the command\n\u200b`)
            .setThumbnail(this.client.user.displayAvatarURL())
            .setFooter(`Commanded by ${message.author.tag} | ${totalcmd} commands has been loaded`, message.author.avatarURL({ dynamic: true }))
            .setTimestamp()
            .addField("\`😉\`| Action", action)
            .addField("\`🐶\`| Animal", animal)
            .addField("\`🎲\`| Fun", fun)
            .addField("\`🎭\`| General", general)
            .addField("\`🖼️\`| Image", image)
            .addField("\`⚙️\`| Moderation", moderation)
            .addField("\`🎶\`| Music", music)
            .addField("\`🛠️\`| Utility", Utility)
            .addField('\u200b', "**Quick Links:【[Vote me](https://top.gg/bot/740112353483554858/vote)】 • 【[Invite me](https://discord.com/oauth2/authorize?client_id=740112353483554858&scope=bot&permissions=2146827639)】**")
        return message.util.send(e)
    }
}