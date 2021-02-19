const { Command } = require("discord-akairo");
const { createEmbed } = require("../../Utils/CreateEmbed")

module.exports = class NukeCommand extends Command {
    constructor() {
        super("NukeCommand", {
            aliases: ["nuke"],
            category: "\`⚙️\`| Moderation",
            description: {
                content: "Clear all ecosystem of the channel",
                usage: "nuke <channel[mention/id]>"
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
            clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_CHANNELS"],
            userPermissions: null,
        })
    };
    async exec(message, { parse }) {
        const channel = message.guild.channels.cache.get(parse) || message.mentions.channels.first();
        if (!channel) return message.channel.send(createEmbed("error", "<a:no:765207855506522173> | Operation Canceled. Please mention channel first")).then(x => { x.delete({ timeout: 10000 }) });

        if (message.channel.activateCollector === true) return message.channel.send(createEmbed("info", "please wait until the timeout over or response has given")).then(msg => { msg.delete({ timeout: 5000 }) });
        try {
            var react = await message.channel.send(createEmbed("info", `Are you sure to Nuke Channel **\`${channel.name}\`**?`));
            message.channel.activateCollector = true
            await react.react('✅');
            await react.react('❎');
            const filter = (reaction, user) => user.id !== this.client.user.id && user.id === message.author.id;
            var collector = react.createReactionCollector(filter, { time: 20000, errors: ['time'] });
            collector.on('collect', (reaction, user) => {
                if (collector && !collector.ended) collector.stop();
                switch (reaction.emoji.name) {
                    case "✅":
                        reaction.users.remove(user);
                        react.edit(createEmbed("spotify", `<a:yes:765207711423004676> | Nuke Channel **\`${channel.name}\`** successful!`)).then(X => { x.delete({ timeout: 3000 }) })
                        channel.clone().then(x => {
                            message.guild.channels.cache.get(x.id).send(createEmbed("info").setAuthor(`Nothing in here, Nuke command successful!`, this.client.user.avatarURL()).setImage("https://cdn.discordapp.com/attachments/795512730940735508/801765196989071390/explosion.gif").setTimestamp().setFooter(`Commanded by: ${message.author.tag}`, this.client.user.avatarURL({ dynamic: true }))).then(x => { x.delete({ timeout: 10000 }) })
                        })
                        setTimeout(() => {
                            channel.delete(`Nuke Command Successful!`)
                        }, 2000);
                        message.channel.activateCollector = false
                        break;

                    case "❎":
                        reaction.users.remove(user);
                        react.edit(createEmbed("error", `<a:no:765207855506522173> | Nuke Channel **\`${channel.name}\`** has canceled!`)).then(x => { x.delete({ timeout: 10000 }) })
                        message.channel.activateCollector = false
                        break;

                    default:
                        reaction.users.remove(user);
                        break;
                }
            })
            collector.on('end', () => {
                react.reactions.removeAll();
                return message.channel.activateCollector = false
            })
        } catch (e) {
            console.log(e)
            react.reactions.removeAll();
            return message.channel.activateCollector = false
        }
    };
}