const { Command } = require("discord-akairo");
const { createEmbed } = require("../../Utils/CreateEmbed");

module.exports = class MockingCaseCommand extends Command {
    constructor() {
        super("MockingCaseCommand", {
            aliases: ["mock"],
            category: "Fun",
            description: {
                content: "Mocking word",
                usage: "mock <thing>"
            },
            args: [
                {
                    id: "content",
                    match: "content"
                }
            ],
            cooldown: 1.5e4,
            channel: "guild",
            ownerOnly: false,
            editable: false,
            typing: true,
            quoted: false,
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
            userPermissions: null,
        })
    }
    async exec(message, { content }) {
        if (!content) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. No query given")).then(x => x.delete({ timeout: 10000 }));
        const after = await mocker(content, () => Math.round(Math.random()));

        let e = createEmbed("info")
            .setAuthor(`${this.client.user.username} • Mocking Case`, this.client.user.avatarURL({ dynamic: true, size: 4096, format: "png" }))
            .setThumbnail("https://cdn.discordapp.com/attachments/406593784697192468/503049110467641345/mock.png")
            .addField("Before", content)
            .addField("After", after)
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, format: "png", size: 4096 }))
        message.channel.send(e)
    }
};
async function mocker(data, randomize) {
    return data.replace(/./g, (str, i) => (randomize(str, i) ? str.toUpperCase() : str.toLowerCase()));
}