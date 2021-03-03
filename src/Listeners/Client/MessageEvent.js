const { Listener } = require("discord-akairo");
const { createEmbed } = require("../../Utils/CreateEmbed");

module.exports = class MessageEvent extends Listener {
    constructor() {
        super("MessageEvent", {
            emitter: "client",
            event: "message",
            category: "client"
        })
    }
    async exec(message) {
        const prefix = this.client.settings.get(message.guild.id, "prefix", "m!");
        const embed = createEmbed("info")
            .setAuthor(`Munari Help`)
            .setThumbnail(`${this.client.user.avatarURL()}`)
            .setDescription(`My prefix is **\`${prefix}\`**\n\nUse **\`${prefix}help\`** to get command list\n**[[INVITE ME](https://top.gg/bot/740112353483554858/invite)] [[VOTE ME](https://top.gg/bot/740112353483554858/vote)]**`)
        const getpref = new RegExp(`^<@!?${this.client.user.id}>( |)$`);
        if ((message.guild !== null && !message.guild.me.hasPermission('SEND_MESSAGES'))) return;
        if (message.channel.type !== 'dm' && !message.channel.permissionsFor(this.client.user).has('SEND_MESSAGES')) return;
        if (message.author.bot) return;
        if (message.content.match(getpref)) return message.channel.send(embed);
    }
}