const { Command } = require("discord-akairo");
const { createEmbed } = require("../../Utils/CreateEmbed")

module.exports = class UnbanCommand extends Command {
    constructor() {
        super("UnbanCommand", {
            aliases: ["unban"],
            category: "Moderation",
            description: {
                content: "Unbanned user from the guild",
                usage: "unban <id>"
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
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "BAN_MEMBERS"],
            userPermissions: ["BAN_MEMBERS"],
        })
    };
    async exec(message, { parse }) {
        const member = parse;
        if (!member) return message.channel.send(createEmbed("error", `<a:no:765207855506522173> | Operation Canceled. Please input the correct data`)).then(msg => { msg.delete({ timeout: 10000 }) })
        if (isNaN(member)) return message.channel.send(createEmbed("error", `<a:no:765207855506522173> | Operation Canceled. Please input the correct data`)).then(msg => { msg.delete({ timeout: 10000 }) })

        let reason = parse
        if (!reason) {
            reason = " - ";
        }
        else {
            reason = `${reason}`
        };

        try {
            const data = await this.client.users.fetch(member)
            var tag = data.tag
            var id = member

            var databan = await message.guild.fetchBans()
        } catch (e) {
            return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Unknown User")).then(msg => { msg.delete({ timeout: 10000 }) })
        };

        if (databan.size < 1) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation canceled because there's no members are banned from this guild")).then(msg => { msg.delete({ timeout: 10000 }) })
        if (databan.get(id) === undefined) return message.channel.send(createEmbed("error", `<a:no:765207855506522173> | Operation Canceled. This user was not banned from this guild`)).then(msg => { msg.delete({ timeout: 10000 }) })

        try {
            await message.guild.members.unban(member, reason );
            return message.channel.send(createEmbed("spotify", `<a:yes:765207711423004676> | Operation to unban **\`${tag}\`** successful!`)).then(msg => { msg.delete({ timeout: 10000 }) })
        } catch (e) {
            return message.channel.send(createEmbed("error", `Sorry i couldn't unban this user because \`\`\`js\n${e.message}\n\`\`\``)).then(msg => { msg.delete({ timeout: 10000 }) })
        }
    };
}