const { Command } = require("discord-akairo");
const { createEmbed } = require("../../Utils/CreateEmbed")

module.exports = class KickCommand extends Command {
    constructor() {
        super("KickCommand", {
            aliases: ["kick"],
            category: "Moderation",
            description: {
                content: "Kick user from guild",
                usage: "kick <user[mention/id]>"
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
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "KICK_MEMBERS"],
            userPermissions: ["KICK_MEMBERS"],
        })
    }
    async exec(message, { parse }) {
        const member =
            message.guild.members.cache.get(parse.split(" ")[0]) ||
            message.mentions.members.first();

        if (!member) return message.channel.send(createEmbed("error", `<a:no:765207855506522173> | Operation Canceled. Please input the correct data`)).then(msg => { msg.delete({ timeout: 10000 }) })

        let reason = parse.split(" ").slice(1).join(" ");
        if (!reason) {
            reason = " - ";
        }
        else {
            reason = `${reason}`
        }

        try {
            if (message.guild.me.roles.highest.comparePositionTo(member.roles.highest) < 0) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. My highest role is lower than the member highest role")).then(msg => { msg.delete({ timeout: 10000 }) })
            if (member.hasPermission('ADMINISTRATOR')) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. This member have **\`ADMINISTRATOR\`** permission")).then(msg => { msg.delete({ timeout: 10000 }) })
            if (!member.kickable) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. This user is not kickable")).then(msg => { msg.delete({ timeout: 10000 }) })
            if (member.user.id === message.author.id) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. You can't kick yourself")`You can't kicked yourself`).then(msg => { msg.delete({ timeout: 10000 }) })
            if (member.user.id === this.client.user.id) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. I can't kick myself")).then(msg => { msg.delete({ timeout: 10000 }) })

        } catch (e) {
            return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Unknown User")).then(msg => { msg.delete({ timeout: 10000 }) })
        }

        try {
            let e = createEmbed("error", `**You has been kicked from ${message.guild.name}\nBecause: ${reason}**`);
            this.client.users.cache.get(member.id) ? this.client.users.cache.get(member.id).send(e) : undefined;
            await member.kick(reason);
            return message.channel.send(createEmbed("spotify", `<a:yes:765207711423004676> | Operation to kick **\`${member.user.tag}\`** successful!`)).then(msg => { msg.delete({ timeout: 10000 }) })
        } catch (e) {
            return message.channel.send(createEmbed("error", `Sorry i couldn't kick this user because \`\`\`js\n${e.message}\n\`\`\``)).then(msg => { msg.delete({ timeout: 10000 }) })
        }
    }
}