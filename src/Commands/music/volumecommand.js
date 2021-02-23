const { Command } = require("discord-akairo");
const { createEmbed } = require("../../Utils/CreateEmbed");

module.exports = class VolumeCommand extends Command {
    constructor() {
        super("VolumeCommand", {
            aliases: ["volume", "v"],
            category: "Music",
            description: {
                content: "CHanges volume of the songs",
                usage: "volume <number>"
            },
            args: [
                {
                    id: "volume",
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
    async exec(message, { volume }) {
        const queue = message.guild.queue
        if (!queue) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Nothing music are playng now")).then(x => x.delete({ timeout: 10000 }));
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. You not in the voiceChannel")).then(x => x.delete({ timeout: 10000 }));
        if (message.guild.me.voice.channel !== null && channel.id !== message.guild.me.voice.channel.id) return message.channel.send(createEmbed("error", `<a:no:765207855506522173> | Operation Canceled. You must join channel **\`🔊${message.guild.me.voice.channel.name}\`** to set the volume`)).then(x => x.delete({ timeout: 10000 }));
        if (!volume) return message.channel.send(createEmbed("info", `**\`🔊\`| The current volume is \`${queue.volume}\`**`)).then(x => x.delete({ timeout: 10000 }));

        if (/^([1-9]?\d|100)$/.test(volume)) {
            if (volume < 5) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. You cannot adjust the volume below 5")).then(x => x.delete({ timeout: 10000 }));
            this.client.shoukaku.setVolume(message, volume)
            message.channel.send(createEmbed("info", `**\`🔊\`| Volume has been change to \`${volume}\`**`)).then(x => x.delete({ timeout: 10000 }))
        } else {
            message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Please input a valid number between 1 - 100")).then(x => x.delete({ timeout: 10000 }))
        }
    }
};