const { Command } = require("discord-akairo");
const { createEmbed } = require("../../Utils/CreateEmbed");

module.exports = class PauseCommand extends Command {
    constructor() {
        super("PauseCommand", {
            aliases: ["pause"],
            category: "Music",
            description: {
                content: "Pauses current playback",
                usage: "pause"
            },
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
    async exec(message) {
        const queue = message.guild.queue;
        if (!queue) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Nothing music are playng now")).then(x => x.delete({ timeout: 10000 }));
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. You not in the voiceChannel")).then(x => x.delete({ timeout: 10000 }));

        if (message.guild.me.voice.channel !== null && channel.id !== message.guild.me.voice.channel.id) return message.channel.send(createEmbed("error", `<a:no:765207855506522173> | Operation Canceled. You must join channel **\`🔊${message.guild.me.voice.channel.name}\`** to pausing the current playback`)).then(x => x.delete({ timeout: 10000 }));
        if (!queue.playing) return message.channel.send(createEmbed("error", `<a:no:765207855506522173> | Operation Canceled. I can't pause the music if music has been paused`)).then(x => x.delete({ timeout: 10000 }));

        await this.client.shoukaku.pause(message);
        return message.channel.send(createEmbed("info", `**The current song has been paused by \`${message.author.username}\`**`));
    }
};