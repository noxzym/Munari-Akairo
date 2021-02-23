const { Command } = require("discord-akairo");
const { createEmbed } = require("../../Utils/CreateEmbed")

module.exports = class PingCommand extends Command {
    constructor() {
        super("PingCommand", {
            aliases: ["ping"],
            category: "Utility",
            description: {
                content: "to give latency and websocket ping",
                usage: "ping"
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
        let latency = Math.round(new Date() - message.createdTimestamp)
        let websocket = this.client.ws.ping

        let ping = createEmbed("info")
            .setTimestamp(message.createdTimestamp)
            .setDescription(`:ping_pong: **Pong! \n\`📶\`Latency = **\`${latency}\`** ms\n\`🖥️\`Websocket = **\`${websocket}\`** ms**`)
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true, size: 4096, format: "png" }))
        message.channel.send(ping)
    }
};

