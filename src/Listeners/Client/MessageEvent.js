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
        const prefix = this.client.commandHandler.prefix;
        const embed = createEmbed("info")
            .setAuthor(`Munari Help`)
            .setThumbnail(`${this.client.user.avatarURL()}`)
            .setDescription(`My prefix is **\`${prefix}\`**\n\nUse **\`${prefix}help\`** to get command list\n**[[INVITE ME](https://top.gg/bot/740112353483554858/invite)] [[VOTE ME](https://top.gg/bot/740112353483554858/vote)]**`)
        const getpref = new RegExp(`^<@!?${this.client.user.id}>( |)$`);
        if ((message.guild !== null && !message.guild.me.hasPermission('SEND_MESSAGES'))) return;
        if (message.channel.type !== 'dm' && !message.channel.permissionsFor(this.client.user).has('SEND_MESSAGES')) return;
        if (message.author.bot) return;
        if (message.content.match(getpref)) return message.channel.send(embed);

        // const args = message.content.replace(this.client.commandHandler.prefix, "");
        // const command = this.client.commandHandler.modules.get(args) || this.client.commandHandler.modules.get(this.client.commandHandler.aliases.get(args));
        // const runCooldowns = this.client.commandHandler.runCooldowns(message, command);
        // if (runCooldowns) {
        //     return console.log(command)
        //     return message.inlineReply(createEmbed("error", `Oof! you hit the cooldown. Please wait **\`${timeleft}\`** to use this command again`)).then(x => { x.delete({ timeout: 10000 }) });
        // }
        // const datar = Object.keys(this.client.commandHandler.cooldowns.get(message.author.id));
        // for (let i = 0; i < datar.length; i++) {
        //     const data = this.client.commandHandler.modules;
        //     const command = data.map(x => x)[i].aliases[0];
        //     const alpha = this.client.commandHandler.runCooldowns(message, command)
        //     console.log(alpha)
        // }
    }
}