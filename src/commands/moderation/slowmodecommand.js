const { Command } = require("discord-akairo");
const { createEmbed } = require("../../utils/createEmbed")
const ms = require('ms');

module.exports = class SlowmodeCommand extends Command {
    constructor() {
        super("SlowmodeCommand", {
            aliases: ["slowmode", "ratelimit"],
            category: "\`⚙️\`| Moderation",
            description: {
                content: "Set ratelimit per user in the channel",
                usage: "slowmode <channel[mention/id]>"
            },
            args: [
                {
                    id: "parse",
                    match: "content"
                }
            ],
            cooldown: 5e3,
            channel: "guild",
            ownerOnly: false,
            editable: false,
            typing: true,
            quoted: false,
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_CHANNELS"],
            userPermissions: null,
        })
    };
    async exec(message, { parse }) {
        const channel = message.guild.channels.cache.get(parse.split(" ")[0]) || message.mentions.channels.first();
        if (!channel) return message.channel.send(createEmbed("error", `<a:no:765207855506522173> | Operation Canceled. Please provide channel first`)).then(x => { x.delete({ timeout: 10000 }) });
        if (!parse.split(" ")[1]) return message.channel.send(createEmbed("error", `<a:no:765207855506522173> | Operation Canceled. You need to provide the time of slowmode`)).then(x => { x.delete({ timeout: 10000 }) });

        let number = (ms(parse.split(" ")[1])) / 1000;
        let nums = await this.client.util.parseMs(number * 1000);

        if (isNaN(number)) return message.channel.send(createEmbed("error", `<a:no:765207855506522173> | Operation Canceled. Please provide the correct time in seconds`)).then(x => { x.delete({ timeout: 10000 }) });
        if (number > 21600) return message.channel.send(createEmbed("error", `<a:no:765207855506522173> | Operation Canceled. Maximal time is 21600 seconds or 6 hours`)).then(x => { x.delete({ timeout: 10000 }) });
        if (number < 0) return message.channel.send(createEmbed("error", `<a:no:765207855506522173> | Operation Canceled. Minimal time is 0 seconds`)).then(x => { x.delete({ timeout: 10000 }) });

        await channel.setRateLimitPerUser(number);
        message.channel.send(createEmbed("spotify", `<a:yes:765207711423004676> | Set ratelimit Channel **\`${channel.name}\`** for **\`${nums}\`** successful!`)).then(x => { x.delete({ timeout: 10000 }) })
    };
}