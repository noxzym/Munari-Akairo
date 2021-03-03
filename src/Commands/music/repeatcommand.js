const { Command } = require("discord-akairo");
const { createEmbed } = require("../../Utils/CreateEmbed");

module.exports = class RepeatCommand extends Command {
    constructor() {
        super("RepeatCommand", {
            aliases: ["repeat", "loop"],
            category: "Music",
            description: {
                content: "Repeating the music queue",
                usage: "repeat [all|one|disable]"
            },
            args: [
                {
                    id: "type",
                    match: "content"
                }
            ],
            cooldown: 5e3,
            channel: "guild",
            ownerOnly: false,
            editable: false,
            typing: false,
            quoted: false,
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            userPermissions: null,
        })
    }
    async exec(message, { type }) {
        const queue = message.guild.queue;
        if (!queue) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Nothing music are playng now")).then(x => x.delete({ timeout: 10000 }));
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. You not in the voiceChannel")).then(x => x.delete({ timeout: 10000 }));
        if (message.guild.me.voice.channel !== null && channel.id !== message.guild.me.voice.channel.id) return message.channel.send(createEmbed("error", `<a:no:765207855506522173> | Operation Canceled. You must join channel **\`🔊${message.guild.me.voice.channel.name}\`** to repeating the music`)).then(x => x.delete({ timeout: 10000 }));

        const mode = {
            all: 2,
            queue: 2,
            2: 2,

            current: 1,
            now: 1,
            1: 1,

            disable: 0,
            off: 0,
            0: 0
        };
        const types = ["Disable", "Only this track", "Queue"];
        const emoji = ["▶", "🔂", "🔁"];
        if (!type) return message.channel.send(createEmbed(
            "info",
            `**${emoji[queue._repeat]} | Current repeat mode is \`${types[queue._repeat]}\`**`
        )).then(x => x.delete({ timeout: 10000 }));

        if (Object.keys(mode).includes(type)) {
            await this.client.shoukaku.repeat(message, type);
            message.channel.send(createEmbed(
                "info", 
                `**${emoji[queue._repeat]} | Loop mode has been set to \`${types[queue._repeat]}\`**`
            )).then(x => x.delete({ timeout: 10000 }));
        } else {
            message.channel.send(createEmbed(
                "error",
                `**<a:no:765207855506522173> | Operation Canceled. See \`${this.client.settings.get(message.guild.id, "prefix", "m!")}help repeat\` for more information**`
            )).then(x => x.delete({ timeout: 10000 }));
        }
    }
};