const { Command } = require("discord-akairo");
const { Message, Guild, TextChannel, VoiceChannel, MessageEmbed, MessageAttachment, DMChannel, NewsChannel, VoiceConnection, Collection, clientEvents, VoiceState, Util } = require('discord.js');
const req = require('node-superfetch')
const util = require('util')

module.exports = class EvalCommand extends Command {
    constructor() {
        super("EvalCommand", {
            aliases: ["eval", "ev"],
            category: "Utility",
            description: {
                content: "Run code snippets",
                usage: "eval <code>"
            },
            args: [
                {
                    id: "code",
                    match: "content"
                },
                {
                    id: "async",
                    match: "flag",
                    flag: "--async"
                },
                {
                    id: "silent",
                    match: "flag",
                    flag: "--silent"
                },
                {
                    id: "asilent",
                    match: "flag",
                    flag: "--async --silent"
                }
            ],
            cooldown: null,
            channel: "guild",
            ownerOnly: true,
            editable: true,
            typing: true,
            quoted: false,
            clientPermissions: ["SEND_MESSAGES"],
            userPermissions: null,
        })
    };
    async exec(message, { code, async, silent, asilent }) {
        const { delmsg } = this.client.util
        let codein = code
        if (!codein) return

        let coder;
        try {
            if (asilent) {
                codein = codein.replace(/\`\`\`/g, "").trim().replace('--async', '').replace('--silent', '');
                await eval(
                    `(async () => {` +
                    `${codein}` +
                    `})()`
                )
                return;
            } else if (async) {
                codein = codein.replace('--async', '')
                coder = await eval(
                    `(async () => {` +
                    `${codein.replace(/\`\`\`/g, "").trim()}` +
                    `})()`
                )
            } else if (silent) {
                codein = codein.replace(/\`\`\`/g, "").trim().replace('--silent', '')
                await eval(codein)
                return;
            } else {
                coder = await eval(codein.replace(/\`\`\`/g, "").trim())
            }

            var outputcode = util.inspect(coder, { depth: 0 });
            var output;
            if (outputcode.length > 1024) {
                const { body } = await req.post('https://paste.mod.gg/documents').send(outputcode)
                output = await message.channel.send([
                    `**Output**\nhttps://paste.mod.gg/${body.key}`,
                ])
            } else {
                output = await message.util.send([
                    `**Output**\n\`\`\`js\n${await clean(outputcode).replace(this.client.token, " [SECRET] ")}\n\`\`\``,
                ])
            }

            await delmsg(output, message)

        } catch (error) {
            var output;

            if (error.length > 1024) {
                const { body } = await req.post('https://paste.mod.gg/documents').send(error)
                output = await message.channel.send([
                    `**Error**\nhttps://paste.mod.gg/${body.key}.js`
                ])
            } else {
                output = await message.util.send([
                    `**Error**\n\`\`\`js\n${error.stack}\n\`\`\``
                ])
            }

            await delmsg(output, message)

        }
    }
};

function clean(text) {
    if (typeof text === "string")
        return text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203));
    else return text;
};