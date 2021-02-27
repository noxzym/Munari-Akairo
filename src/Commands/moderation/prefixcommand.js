const { Command } = require("discord-akairo");
const { createEmbed } = require("../../Utils/CreateEmbed");

module.exports = class PrefixCommand extends Command {
    constructor() {
        super("PrefixCommand", {
            aliases: ["prefix"],
            category: "Moderation",
            description: {
                content: "Displays the current prefix or changes it",
                usage: "prefix [newPrefix]"
            },
            args: [
                {
                    id: "prefix",
                    match: "content"
                },
                {
                    id: "clear",
                    match: "flag",
                    flag: "clear"
                }
            ],
            cooldown: 5e3,
            channel: "guild",
            ownerOnly: false,
            editable: false,
            typing: true,
            quoted: false,
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            userPermissions: ["MANAGE_GUILD"],
        })
    }
    async exec(message, { prefix, clear }) {
        if (!prefix) return message.channel.send(createEmbed("info", `**The current prefix is \`${this.client.settings.get(message.guild.id, "prefix", "m!")}\`**`)).then(x => x.delete({ timeout: 10000 }));

        if (clear) {
            await this.client.settings.clear(message.guild.id);
            return message.channel.send(createEmbed("info", `**The current prefix has been set to default**`)).then(x => x.delete({ timeout: 10000 }));
        }

        if (prefix.length > 3) return message.channel.send(createEmbed("error", "**<a:no:765207855506522173> | Operation Canceled. Maximum length of prefix is 3**"));
        if (!this.client.settings.get(message.guild.id, "prefix") && prefix === this.handler.prefix(message.guild.id)) return message.channel.send(createEmbed("info", `**The current prefix is \`${this.client.settings.get(message.guild.id, "prefix", "m!")}\`**`)).then(x => x.delete({ timeout: 10000 }));
        if (this.client.settings.get(message.guild.id, "prefix") !== undefined && prefix === this.handler.prefix(message.guild.id)) {
            await this.client.settings.clear(message.guild.id);
            return message.channel.send(createEmbed("info", `**The current prefix has been set to default**`)).then(x => x.delete({ timeout: 10000 }));
        }

        try {
            await this.client.settings.set(message.guild.id, "prefix", prefix);
            return message.channel.send(createEmbed("info", `**The current prefix has been set to \`${this.client.settings.get(message.guild.id, "prefix")}\`**`)).then(x => x.delete({ timeout: 10000 }));
        } catch (e) {
            message.channel.send(createEmbed("error", `**<a:no:765207855506522173> | Operation Canceled. I can't changes the guild prefix because: \`${e.message}\`**`)).then(x => x.delete({ timeout: 10000 }));
        }
    }
};