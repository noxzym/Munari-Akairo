const { Listener } = require("discord-akairo");
const { createEmbed } = require("../../Utils/CreateEmbed");

module.exports = class ShoobTimerEvent extends Listener {
    constructor() {
        super("ShoobTimerEvent", {
            emitter: "client",
            event: "message",
            category: "client",
        })
    }
    async exec(message) {
        if (message.channel.type === 'dm') return
        if ((message.guild !== null && !message.guild.me.hasPermission('SEND_MESSAGES'))) return
        if (message.channel.type !== 'dm' && !message.channel.permissionsFor(this.client.user).has('SEND_MESSAGES')) return
        try {
            let embed = message.embeds[0];

            if (message.guild.id === '733474234600521850') return;
            if (message.author.id !== '673362753489993749') return;
            if (!embed) return
            if (!embed.title) return;
            if (!embed.title.includes("Tier")) return;
            if (!embed.image) return;

            var i = 15;
            let time = await message.channel.send(createEmbed("info").setDescription(`:green_circle:**\`| ❝ ${embed.title} ❞ Despawn in ${i}\`**`))

            var interval = setInterval(() => {
                i = i - 5;
                if (i === 15) {
                    time.edit(createEmbed().setDescription(`:green_circle:**\`| ❝ ${embed.title} ❞ Despawn in ${i}\`**`).setColor('#78b159'))
                }
                if (i === 10) {
                    time.edit(createEmbed().setDescription(`:yellow_circle:**\`| ❝ ${embed.title} ❞ Despawn in ${i}\`**`).setColor('#fdcb58'))
                }
                if (i === 5) {
                    time.edit(createEmbed().setDescription(`:red_circle:**\`| ❝ ${embed.title} ❞ Despawn in ${i}\`**`).setColor('#dd2e44'))
                }
                if (i === 0) {
                    clearInterval(interval)
                    time.edit(createEmbed().setDescription(`:black_circle:**\`| ❝ ${embed.title} ❞ Despawn in ${i}\`**`).setColor('#31373d')).then(x => x.delete({ timeout: 3000 }))
                }
            }, 5000);

        } catch {}
    }
};