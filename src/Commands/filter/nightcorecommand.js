const { Command } = require("discord-akairo");
const { createEmbed } = require("../../Utils/CreateEmbed");

module.exports = class NightcoreCommand extends Command {
    constructor() {
        super("NightcoreCommand", {
            aliases: ["nightcore", "anc"],
            category: "Filter",
            description: {
                content: "Changes music filter to nightcore",
                usage: "nightcore"
            },
            cooldown: 5e3,
            channel: "guild",
            ownerOnly: false,
            editable: false,
            typing: true,
            quoted: false,
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            userPermissions: null,
        })
    }
    async exec(message) {
        const queue = message.guild.queue;
        if (!queue) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Nothing music are playng now")).then(x => x.delete({ timeout: 10000 }));
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. You not in the voiceChannel")).then(x => x.delete({ timeout: 10000 }));

        if (message.guild.me.voice.channel !== null && channel.id !== message.guild.me.voice.channel.id) return message.channel.send(createEmbed("error", `<a:no:765207855506522173> | Operation Canceled. You must join channel **\`🔊${message.guild.me.voice.channel.name}\`**`)).then(x => x.delete({ timeout: 10000 }));

        if (queue.player.filters.timescale) {
            let send = await message.channel.send(createEmbed("info", "<a:loading2:763336904108146698> | Another filter was found, replaced it"));
            this.client.shoukaku.setFilter(message, "nightcore");
            setTimeout(() => {
                return send.edit(createEmbed("info", "**<a:yes:765207711423004676> | Successful to Set \`Nightcore\` Filters**")).then(x => x.delete({ timeout: 10000 }));
            }, 6000);
        }
        let send = await message.channel.send(createEmbed("info", "<a:loading2:763336904108146698> | Please Wait..."));
        this.client.shoukaku.setFilter(message, "nightcore");
        setTimeout(() => {
            return send.edit(createEmbed("info", "**<a:yes:765207711423004676> | Successful to Set \`Nightcore\` Filters**")).then(x => x.delete({ timeout: 10000 }));
        }, 6000);
    }
};