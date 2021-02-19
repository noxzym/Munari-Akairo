const { Command } = require("discord-akairo");
const { createEmbed } = require("../../Utils/CreateEmbed");

module.exports = class StopCommand extends Command {
    constructor() {
        super("StopCommand", {
            aliases: ["stop"],
            category: "\`🎶\`| Music",
            description: {
                content: "Stopping the music and leaving bot from voice channel",
                usage: "stop"
            },
            cooldown: 1e4,
            channel: "guild",
            ownerOnly: false,
            editable: false,
            typing: false,
            quoted: false,
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            userPermissions: null,
        })
    };
    async exec(message) {
        const queue = message.guild.queue;
        if (!queue) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Nothing music are playng now")).then(x => x.delete({ timeout: 10000 }));
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. You not in the voiceChannel")).then(x => x.delete({ timeout: 10000 }));

        if (message.guild.me.voice.channel !== null && channel.id !== message.guild.me.voice.channel.id) return message.channel.send(createEmbed("error", `<a:no:765207855506522173> | Operation Canceled. You must join channel **\`🔊${message.guild.me.voice.channel.name}\`** to stop the music`)).then(x => x.delete({ timeout: 10000 }));
        await this.client.shoukaku.stop(message);

        message.channel.send(createEmbed("info", `**Music has been stopped by \`${message.author.username}\`**`)).then(x => x.delete({ timeout: 10000 }));
    };
};