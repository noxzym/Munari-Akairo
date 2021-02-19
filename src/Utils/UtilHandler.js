const prettyMilliseconds = require("pretty-ms");
const CanvasHandler = require("./CanvasHandler");

module.exports = class UtilHandler {
    constructor(client) {
        this.client = client;
        this.canvas = new CanvasHandler(client);
    };

    /*Function*/
    async parseMs(value) {
        if (isNaN(value)) return;
        return prettyMilliseconds(value, { verbose: true, compact: false, secondsDecimalDigits: 0 })
    };
    async parsemsg(Util, message, args) {
        const parse = message.content.trim().split(" ");
        const parsedata = parse[1] !== undefined && parse[1].includes("^") ? parse[1].length : 0;
        const fetchmsg = await message.channel.messages.fetch(true).then(x => { return x.map(x => x)[parsedata] });
        var fetchattachment, fetchembeds, fetchmsgauthor, fetchemojimsg, mentionuser, mentionuserid, fetchavatarauthor;
        try {
            fetchattachment = fetchmsg.attachments.size !== 0 ? fetchmsg.attachments.first().url : undefined;
            fetchembeds = fetchattachment === undefined && fetchmsg.embeds.map(x => { return x.image }).join(" ") !== '' ? fetchmsg.embeds.map(x => { return x.image.url }).join(" ") : undefined;
            fetchmsgauthor = fetchattachment === undefined && fetchembeds === undefined && fetchmsg.content.includes("https://cdn.discordapp.com") ? fetchmsg.content.trim().split(" ")[1] : undefined;
            fetchemojimsg = fetchattachment === undefined && fetchembeds === undefined && !fetchmsg.content.includes("https://cdn.discordapp.com") && Util.parseEmoji(fetchmsg.content).id !== null ? Util.parseEmoji(fetchmsg.content).animated === false ? `https://cdn.discordapp.com/emojis/${Util.parseEmoji(fetchmsg.content).id}.png?size=4096` : `https://cdn.discordapp.com/emojis/${Util.parseEmoji(fetchmsg.content).id}.gif` : undefined;
            mentionuser = fetchattachment === undefined && fetchembeds === undefined && fetchmsgauthor === undefined && fetchemojimsg === undefined && Util.parseEmoji(fetchmsg.content).id === null && message.mentions.members.first() !== undefined ? message.mentions.members.first().user.avatarURL({ size: 4096, format: "png" }) : undefined;
            mentionuserid = fetchattachment === undefined && fetchembeds === undefined && fetchmsgauthor === undefined && fetchemojimsg === undefined && Util.parseEmoji(fetchmsg.content).id === null && message.mentions.members.first() === undefined && message.guild.members.cache.get(args[0]) !== undefined ? message.guild.members.cache.get(args[0]).user.avatarURL({ size: 4096, format: "png" }) : undefined;
            fetchavatarauthor = fetchattachment === undefined && fetchembeds === undefined && fetchmsgauthor === undefined && fetchemojimsg === undefined && Util.parseEmoji(fetchmsg.content).id === null && mentionuser === undefined && mentionuserid === undefined ? fetchmsg.author.avatarURL({ size: 4096, format: "png" }) : undefined;
        } catch (e) {
            throw Error("Invalid Data")
        }
        const data = fetchattachment || fetchembeds || fetchmsgauthor || fetchemojimsg || mentionuser || mentionuserid || fetchavatarauthor;
        return data
    };
    async delmsg(send, msg) {
        const emo = ["🇽"];
        for (const emoji of emo) await send.react(emoji);

        var collector = send.createReactionCollector((reaction, user) => emo.includes(reaction.emoji.name) && user.id === msg.author.id);
        collector.on("collect", async (reaction) => {
            switch (reaction.emoji.name) {
                case "🇽":
                    await send.delete()
                    break;

                default:
                    break;
            }
        })
    };
    async pagination(send, page, datae, message) {
        const emo = ["🇽", "⏪", "⬅️", "➡️", "⏩", "⏹️"];
        for (const emoji of emo) await send.react(emoji);

        var collector = send.createReactionCollector((reaction, user) => emo.includes(reaction.emoji.name) && user.id === message.author.id);
        collector.on('collect', async (reaction, user) => {
            switch (reaction.emoji.name) {

                case "🇽":
                    await send.delete();
                    break;

                case "⏹️":
                    message.channel.permissionsFor(this.client.user.id).has("MANAGE_MESSAGES") ? await send.reactions.removeAll() : undefined;
                    await collector.stop();
                    break;

                case "⏪":
                    message.channel.permissionsFor(this.client.user.id).has("MANAGE_MESSAGES") ? await reaction.users.remove(user) : undefined;
                    if (page === 0) return;
                    page = datae.length - datae.length
                    send.edit(datae[page]);
                    break;

                case "⏩":
                    message.channel.permissionsFor(this.client.user.id).has("MANAGE_MESSAGES") ? await reaction.users.remove(user) : undefined;
                    page = datae.length - 1;
                    send.edit(datae[page]);
                    break;

                case "⬅️":
                    message.channel.permissionsFor(this.client.user.id).has("MANAGE_MESSAGES") ? await reaction.users.remove(user) : undefined;
                    if (page === 0) return
                    --page;
                    send.edit(datae[page]);
                    break;

                case "➡️":
                    message.channel.permissionsFor(this.client.user.id).has("MANAGE_MESSAGES") ? await reaction.users.remove(user) : undefined;
                    if (page + 2 > datae.length) return
                    page++;
                    send.edit(datae[page]);
                    break;

                default:
                    break;

            }
        })
        return collector
    };
}