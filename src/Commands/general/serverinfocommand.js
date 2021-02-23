const { Command } = require("discord-akairo");
const { createEmbed } = require("../../Utils/CreateEmbed");
const moment = require('moment');
moment.locale()

module.exports = class ServerinfoCommand extends Command {
    constructor() {
        super("ServerinfoCommand", {
            aliases: ["serverinfo", "si"],
            category: "General",
            description: {
                content: "Display server informations",
                usage: "serverinfo"
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
        const sname = message.guild.name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
        const sreg = message.guild.region.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
        const sver = message.guild.verificationLevel.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');
        const sbos = message.guild.premiumSubscriptionCount;
        const scr = moment(message.guild.createdAt).format('MMM Do YYYY');

        const channel = message.guild.channels.cache.size;
        const channelc = message.guild.channels.cache.filter(c => c.type === 'category').size;
        const channelt = message.guild.channels.cache.filter(c => c.type === "text").size;
        const channelv = message.guild.channels.cache.filter(c => c.type === "voice").size;

        const membert = message.guild.members.cache.size;
        const online = message.guild.members.cache.filter(x => x.presence.status === 'online').size;
        const offline = message.guild.members.cache.filter(x => x.presence.status !== 'online').size;
        const idle = message.guild.members.cache.filter(x => x.presence.status === 'idle').size;
        const dnd = message.guild.members.cache.filter(x => x.presence.status === 'dnd').size;

        const owner = message.guild.owner.user.tag
        const ownerid = message.guild.owner.user.id
        const ownercr = moment(message.guild.owner.user.createdAt).format('MMM Do YYYY');
        const ownerjo = moment(message.guild.owner.joinedAt).format('MMM Do YYYY');

        const e = createEmbed("info")
            .setTitle('Server Informations')
            .addField(
                "__Overview__",
                `**\`\`\`asciidoc\n` +
                `• Name     :: ${sname}\n` +
                `• ID       :: ${message.guild.id}\n` +
                `• Region   :: ${sreg}\n` +
                `• Verif    :: ${sver}\n` +
                `• Created  :: ${scr}\n` +
                `• Booster  :: ${sbos}\n` +
                `\`\`\`**`
            )
            .addField(
                "__Details__",
                `**\`\`\`asciidoc\n` +
                `• Roles    :: ${message.guild.roles.cache.size}\n` +
                `• Channels :: [${channel}]\n` +
                `           :: ${channelc} Category\n` +
                `           :: ${channelt} Text\n` +
                `           :: ${channelv} Voice\n` +
                `• Members  :: [${membert}]\n` +
                `           :: ${online} Online\n` +
                `           :: ${idle} Idle\n` +
                `           :: ${dnd} DND\n` +
                `           :: ${offline} Offline\n` +
                `\`\`\`**`
            )
            .addField(
                "__Owner Server__",
                `**\`\`\`asciidoc\n` +
                `• UserName :: ${owner}\n` +
                `• UserID   :: ${ownerid}\n` +
                `• Created  :: ${ownercr}\n` +
                `• Joined   :: ${ownerjo}\n` +
                `\`\`\`**`
            )
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
        message.channel.send(e)
    }
};