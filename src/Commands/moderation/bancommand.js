const { Command } = require("discord-akairo");
const { createEmbed } = require("../../Utils/CreateEmbed")

module.exports = class BanCommand extends Command {
    constructor() {
        super("BanCommand", {
            aliases: ["ban"],
            category: "Moderation",
            description: {
                content: "Ban user from the guild",
                usage: "ban <user[mention/id]>"
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
            userPermissions: null,
        })
    };
    async exec(message, { parse }) {
        const member =
            message.guild.members.cache.get(parse) ||
            message.mentions.members.first() ||
            parse;

        if (!member) return message.channel.send(createEmbed("error", `<a:no:765207855506522173> | Operation Canceled. Please input the correct data`)).then(msg => { msg.delete({ timeout: 10000 }) })
        if (isNaN(member)) return message.channel.send(createEmbed("error", `<a:no:765207855506522173> | Operation Canceled. Please input the correct data`)).then(msg => { msg.delete({ timeout: 10000 }) })

        let reason = parse.slice(1).join(" ");
        if (!reason) {
            reason = " - ";
        }
        else {
            reason = `${reason}`
        };

        try {
            if (member.user !== undefined) {
                if (message.guild.me.roles.highest.comparePositionTo(member.roles.highest) < 0) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. My highest role is lower than the member highest role")).then(msg => { msg.delete({ timeout: 10000 }) })
                if (member.hasPermission('ADMINISTRATOR')) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. This member have **\`ADMINISTRATOR\`** permission")).then(msg => { msg.delete({ timeout: 10000 }) })
                if (!member.bannable) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. This user is not bannable")).then(msg => { msg.delete({ timeout: 10000 }) })
                if (member.user.id === message.author.id) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. You can't ban yourself")`You can't kicked yourself`).then(msg => { msg.delete({ timeout: 10000 }) })
                if (member.user.id === this.client.user.id) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. I can't ban myself")).then(msg => { msg.delete({ timeout: 10000 }) })
            };

            var tag;
            var id;
            if (member.user !== undefined) {
                tag = member.user.tag
                id = member.user.id
            } else {
                const data = await this.client.users.fetch(member)
                tag = data.tag
                id = member
            }

            var databan = await message.guild.fetchBans()
        } catch (e) {
            return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Unknown User")).then(msg => { msg.delete({ timeout: 10000 }) })
        }

        if (databan.get(id) !== undefined) return message.channel.send(createEmbed("error", `<a:no:765207855506522173> | Operation Canceled. This user has been banned from this guild`)).then(msg => { msg.delete({ timeout: 10000 }) });

        try {
            let e = createEmbed("error", `**You has been banned from ${message.guild.name}\nBecause: ${reason}**`);
            this.client.users.cache.get(id) ? this.client.users.cache.get(id).send(e) : undefined;
            await message.guild.members.ban(member, { reason: reason })
            return message.channel.send(createEmbed("spotify", `<a:yes:765207711423004676> | Operation to ban **\`${tag}\`** successful!`)).then(msg => { msg.delete({ timeout: 10000 }) })
        } catch (e) {
            return message.channel.send(createEmbed("error", `Sorry i couldn't ban this user because \`\`\`js\n${e.message}\n\`\`\``)).then(msg => { msg.delete({ timeout: 10000 }) })
        }
    };
}