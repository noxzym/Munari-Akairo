const { Command } = require("discord-akairo");
const { exec } = require("child_process")

module.exports = class ExecCommand extends Command {
    constructor() {
        super("ExecCommand", {
            aliases: ["execute", "exec", "ex"],
            category: "Utility",
            description: {
                content: "Execute program",
                usage: "execute <file/code>"
            },
            args: [
                {
                    id: "code",
                    match: "content"
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
    async exec(message, { code }) {
        if (!code) return;
        message.util.send(`❯_ ${code}`)
        exec(code, async(e, stdout, stderr) => {
            if (e) return message.util.edit(`\`\`\`js\n${e.message}\n\`\`\``);
            if (!stderr && !stdout) return message.util.edit("Success without results!");
            if (stdout) {
                const pages = await pagination(stdout, 1950);
                for (const page of pages) {
                    await message.channel.send(page, { code: 'bash' })
                }
            };
            if (stderr) {
                const pages = await pagination(stderr, 1950);
                for (const page of pages) {
                    await message.channel.send(page, { code: 'bash' })
                }
            }
        });
    }
};
async function pagination(text, limit) {
    const lines = text.trim().split("\n");
    const pages = [];
    let chunk = "";

    for (const line of lines) {
        if (chunk.length + line.length > limit && chunk.length > 0) {
            pages.push(chunk);
            chunk = "";
        }

        if (line.length > limit) {
            const lineChunks = line.length / limit;

            for (let i = 0; i < lineChunks; i++) {
                const start = i * limit;
                const end = start + limit;
                pages.push(line.slice(start, end));
            }
        } else {
            chunk += `${line}\n`;
        }
    }

    if (chunk.length > 0) {
        pages.push(chunk);
    }

    return pages;
}