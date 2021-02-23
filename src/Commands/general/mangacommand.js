const { Command } = require("discord-akairo");
const { Util } = require("discord.js");
const { createEmbed } = require("../../Utils/CreateEmbed")
const { get } = require("axios");
const moment = require("moment");
moment.locale()

module.exports = class MangaCommand extends Command {
    constructor() {
        super("MangaCommand", {
            aliases: ["manga"],
            category: "General",
            description: {
                content: "Get manga information by title",
                usage: "manga <title>"
            },
            args: [
                {
                    id: "title",
                    match: "content"
                },
                {
                    id: "search",
                    match: "flag",
                    flag: ["--search"]
                }
            ],
            cooldown: 1e4,
            channel: "guild",
            ownerOnly: false,
            editable: false,
            typing: true,
            quoted: false,
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            userPermissions: null,
        })
    }
    async exec(message, { title, search }) {
        if (!title) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Please input manga title")).then(x => { x.delete({ timeout: 10000 }) })

        const { data } = await get(`https://kitsu.io/api/edge/manga?filter[text]=${encodeURI(title.replace("--search", ""))}`, { method: "GET", headers: { 'Content-Type': "application/vnd.api+json", 'Accept': "application/vnd.api+json" } });
        if (data.data.length === 0) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. 404 Not Found")).then(x => { x.delete({ timeout: 10000 }) })
        var result = await data.data;

        message.channel.startTyping()

        if (search) {
            let i = 1;
            let resultmap = await result.slice(0, 5).map((x) => `**${i++} • [\`${x.attributes.titles.en_jp}\`](https://kitsu.io/manga/${x.attributes.slug})**`).join("\n");

            let e = createEmbed("info")
                .setAuthor(`Result for Manga ${title.replace("--search", "")}`, "https://cdn.discordapp.com/attachments/795512730940735508/809331254544826378/kitsuicon.png", "https://kitsu.io/explore/manga")
                .setDescription(resultmap)
                .setFooter(`Type 'cancel' to cancel the song request`)
            var emb = await message.channel.send(e)

            try {
                var response = await message.channel.awaitMessages(
                    message2 => /^(?:[1-4]|5|cancel|c)$/.test(message2.content.toLowerCase()) && message2.author.id === message.author.id, {
                    max: 1,
                    time: 30000,
                    errors: ["time"]
                });

                const input = response.first().content.substr(0, 5).toLowerCase()
                if (input === 'cancel' || input === 'c') {
                    emb.suppressEmbeds(true).then(x => { x.edit(`<a:no:765207855506522173> | Request canceled`) })
                    message.channel.stopTyping()
                    return emb.delete({ timeout: 3000 })
                }
                emb.delete()
                var resultresponse = await result[parseInt(response.first().content) - 1]
            } catch (e) {
                message.channel.stopTyping()
                return message.channel.send(createEmbed("error", 'The request has canceled because no response')).then(x => x.delete({ timeout: 10000 }))
            }

            const finalresult = await resultresponse;
            const datar = await get(finalresult.relationships.genres.links.related, { method: "GET", headers: { 'Content-Type': "application/vnd.api+json", 'Accept': "application/vnd.api+json" } });
            const genre = await datar.data.data.map(({ attributes }) => attributes.name).join(" ")

            let emcover = createEmbed("info")
                .setAuthor(finalresult.attributes.titles.en_jp, "https://cdn.discordapp.com/attachments/795512730940735508/809331254544826378/kitsuicon.png", `https://kitsu.io/manga/${finalresult.attributes.slug}`)
                .setThumbnail(finalresult.attributes.posterImage.large)
                .setDescription(
                    `\`\`\`asciidoc\n` +
                    `• Title    :: ${finalresult.attributes.titles.en_jp}\n` +
                    `• JPTitle  :: ${finalresult.attributes.titles.ja_jp}\n` +
                    `• Type     :: ${finalresult.attributes.subtype}\n` +
                    `• Rating   :: ${finalresult.attributes.averageRating}\n` +
                    `• Genres   :: ${genre}\n` +
                    `• Created  :: ${moment(finalresult.attributes.createdAt).format("MMM Do YYYY")}\n` +
                    `• Updated  :: ${moment(finalresult.attributes.updatedAt).format("MMM Do YYYY")}\n` +
                    `• Synopsis ::\n${Util.escapeMarkdown(finalresult.attributes.synopsis)}\n` +
                    `\`\`\``
                )
                .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
                .setTimestamp();

            message.channel.stopTyping()
            return message.channel.send(emcover)
        }
        const finalresult = await result[0];
        const datar = await get(finalresult.relationships.genres.links.related, { method: "GET", headers: { 'Content-Type': "application/vnd.api+json", 'Accept': "application/vnd.api+json" } });
        const genre = await datar.data.data.map(({ attributes }) => attributes.name).join(" ");

        let emcover = createEmbed("info")
            .setAuthor(finalresult.attributes.titles.en_jp, "https://cdn.discordapp.com/attachments/795512730940735508/809331254544826378/kitsuicon.png", `https://kitsu.io/manga/${finalresult.attributes.slug}`)
            .setThumbnail(finalresult.attributes.posterImage.large)
            .setDescription(
                `\`\`\`asciidoc\n` +
                `• Title    :: ${finalresult.attributes.titles.en_jp}\n` +
                `• JPTitle  :: ${finalresult.attributes.titles.ja_jp}\n` +
                `• Type     :: ${finalresult.attributes.subtype}\n` +
                `• Rating   :: ${finalresult.attributes.averageRating}\n` +
                `• Genres   :: ${genre}\n` +
                `• Created  :: ${moment(finalresult.attributes.createdAt).format("MMM Do YYYY")}\n` +
                `• Updated  :: ${moment(finalresult.attributes.updatedAt).format("MMM Do YYYY")}\n` +
                `• Synopsis ::\n${Util.escapeMarkdown(finalresult.attributes.synopsis)}\n` +
                `\`\`\``
            )
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
            .setTimestamp();
        message.channel.send(emcover)
        message.channel.stopTyping()
    }
}